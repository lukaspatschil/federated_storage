import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Empty,
  PictureWithoutData,
  PictureWithoutDataArray,
  SensorData,
  SensorDataArray,
  SensorDataCreationWithoutPictureData,
  SensorDataWithoutPictureDataUpdate,
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

  async findNextPictureOfPicture(id: string): Promise<PictureWithoutData> {
    this.logger.log(`Finding all pictures by picture id. ${id}`);

    // returns sensordataDocument
    const data = await this.sensorDataModel.findOne({
      pictures: {
        $elemMatch: { _id: id },
      },
    });

    if (data === undefined || data === null) {
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Could not get sensordata entry',
      });
    }

    const sensordataObject = this.mapSensorDataDocumentToSensorData(data);

    const currentImage = await this.findOnePicture(id);

    /*let latestPicture
    sensordataObject.then(
        (result) => {
          // sort data by timestamp otherwise
          latestPicture = data?.pictures
              .sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime())
              .filter((a) => a.createdAt < new Date(result.createdAt))?.[0];
        }
    )*/

    const latestPicture = sensordataObject.pictures
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .filter(
        (a) => new Date(a.createdAt) < new Date(currentImage.createdAt),
      )?.[0];

    this.logger.log('Upcoming id: ' + JSON.stringify(latestPicture));

    if (latestPicture === undefined) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'not possible to determine former image data',
      });
    }
    return latestPicture as any;
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

  async updateOne(
    data: SensorDataWithoutPictureDataUpdate,
  ): Promise<SensorData> {
    this.logger.log(`Updating sensor data by id. ${data.id}`);
    const filter = { _id: data.id };
    const update = this.mapSensorDataUpdateToSensorData(data);
    this.logger.log(`Update object: ${JSON.stringify(update)}`);
    const response = await this.sensorDataModel.findOneAndUpdate(
      filter,
      update,
      { new: true },
    );

    if (!response) {
      this.logger.error('RPC Error');
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `Data with id ${data.id} not found`,
      });
    }

    return this.mapSensorDataDocumentToSensorData(response) as any;
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
    if (
      data === undefined ||
      data.metadata === undefined ||
      data.metadata.location === undefined
    ) {
      throw new RpcException({
        code: status.INTERNAL,
        message: 'mongodb response not well formatted',
      });
    }
    return {
      pictures: [
        {
          ...data.picture,
          createdAt: new Date(),
        },
      ],
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

  private mapSensorDataUpdateToSensorData(
    data: SensorDataWithoutPictureDataUpdate,
  ) {
    if (!data) {
      throw new RpcException({
        code: status.INTERNAL,
        message: 'mongodb response not well formatted',
      });
    }
    this.logger.log('Update data: ' + JSON.stringify(data));
    const sensorData = {
      pictures: [
        data.picture
          ? {
              ...data.picture,
              createdAt: new Date(),
            }
          : undefined,
      ],
      metadata: {
        name: data.metadata?.name,
        placeIdent: data.metadata?.placeIdent,
        seqId: data.metadata?.seqId,
        datetime: data.metadata?.datetime
          ? new Date(data.metadata.datetime)
          : undefined,
        frameNum: data.metadata?.frameNum,
        seqNumFrames: data.metadata?.seqNumFrames,
        filename: data.metadata?.filename,
        deviceID: data.metadata?.deviceID,
        location: {
          coordinates: [
            data.metadata?.location?.longitude,
            data.metadata?.location?.latitude,
          ],
        },
        tags: data.metadata?.tagsWrapper?.tags,
      },
    };
    const update = { $set: {}, $push: {} };

    for (const [key, value] of Object.entries(sensorData)) {
      if (key === 'pictures' && value[0]) {
        const picture = {};
        for (const [pictureKey, pictureValue] of Object.entries(value[0])) {
          picture[pictureKey] = pictureValue;
        }
        update.$push[`${key}`] = picture;
      }

      if (key === 'metadata' && value) {
        for (const [metadataKey, metadataValue] of Object.entries(value)) {
          if (metadataKey === 'location') {
            if (metadataValue.coordinates[0])
              update.$set[`${key}.${metadataKey}.coordinates.0`] =
                metadataValue.coordinates[0];
            if (metadataValue.coordinates[1])
              update.$set[`${key}.${metadataKey}.coordinates.1`] =
                metadataValue.coordinates[1];
          } else {
            if (metadataValue)
              update.$set[`${key}.${metadataKey}`] = metadataValue;
          }
        }
      }
      if (key === 'tags' && value) {
        if (value) update.$set[`${key}`] = value;
      }
    }

    return update;
  }
}
