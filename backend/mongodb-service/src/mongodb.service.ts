import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Empty,
  PictureWithoutData,
  SensorData,
  SensorDataArray,
  SensorDataCreationWithoutPictureData,
} from './service-types/types/proto/shared';
import { PictureDocument } from './schema/Picture.schema';
import { SensorDataDocument } from './schema/SensorData.schema';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Injectable()
export class MongoDBService {
  private readonly logger = new Logger(MongoDBService.name);

  constructor(
    @InjectModel(SensorDataDocument.name)
    private readonly sensorDataModel: Model<SensorDataDocument>,
    @InjectModel(PictureDocument.name)
    private readonly pictureModel: Model<PictureDocument>,
  ) {}

  async findAll(): Promise<SensorDataArray> {
    this.logger.log('Finding all sensor data.');

    const data = await this.sensorDataModel.find();

    const response = {
      sensorData: (data ?? []).map(this.mapSensorDataDocumentToSensorData),
    };

    return response as any;
  }

  async findOne(id: string): Promise<SensorData> {
    this.logger.log(`Finding sensor data by id. ${id}`);

    const data = await this.sensorDataModel.findById(id);
    if (!data) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `MetaData with id ${id} not found`,
      });
    }

    return this.mapSensorDataDocumentToSensorData(data) as any;
  }

  async findOnePicture(id: string): Promise<PictureWithoutData> {
    this.logger.log(`Finding picture data by id. ${id}`);

    const data = await this.sensorDataModel.findOne({
      pictures: { $elemMatch: { _id: id } },
    });

    const picture = data?.pictures.find((el) => el.id === id);

    if (!picture) {
      this.logger.error('RPC Error');
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Picture with id ${id} not found`,
      });
    }

    return picture as any;
  }

  async createOne(
    data: SensorDataCreationWithoutPictureData,
  ): Promise<SensorData> {
    this.logger.log(`Creating sensor data. ${JSON.stringify(data)}`);

    const response = await this.sensorDataModel.create(
      this.mapCreateSensorDataToSensorData(data),
    );

    return this.mapSensorDataDocumentToSensorData(response) as any;
  }

  async deleteOne(id: string): Promise<Empty> {
    this.logger.log(`Deleting sensor data by id. ${id}`);

    const data = await this.sensorDataModel.findByIdAndRemove(id);
    if (!data) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `MetaData with id ${id} not found`,
      });
    }

    return {};
  }

  private mapSensorDataDocumentToSensorData(data: SensorDataDocument) {
    return {
      id: data._id,
      pictures: data.pictures.map((picture) => ({
        id: picture._id,
        createdAt: picture.createdAt.toISOString(),
        mimetype: picture.mimetype,
        hash: picture.hash,
      })),
      metadata: {
        name: data.metadata.name,
        placeIdent: data.metadata.placeIdent,
        seqId: data.metadata.seqId,
        datetime: data.metadata.datetime.toISOString(),
        frameNum: data.metadata.frameNum,
        seqNumFrames: data.metadata.seqNumFrames,
        filename: data.metadata.filename,
        deviceID: data.metadata.deviceID,
        location: {
          longitude: data.metadata.location.coordinates[0],
          latitude: data.metadata.location.coordinates[1],
        },
        tags: data.metadata.tags,
      },
    };
  }

  private mapCreateSensorDataToSensorData(
    data: SensorDataCreationWithoutPictureData,
  ) {
    return {
      pictures: [data.picture],
      metadata: {
        name: data.metadata.name,
        placeIdent: data.metadata.placeIdent,
        seqId: data.metadata.seqId,
        datetime: new Date(data.metadata.datetime),
        frameNum: data.metadata.frameNum,
        seqNumFrames: data.metadata.seqNumFrames,
        filename: data.metadata.filename,
        deviceID: data.metadata.deviceID,
        location: {
          type: 'Point',
          coordinates: [
            data.metadata.location.longitude,
            data.metadata.location.latitude,
          ],
        },
        tags: [],
      },
    };
  }
}
