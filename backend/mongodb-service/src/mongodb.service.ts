import { Model } from 'mongoose';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MetaData } from './schema/MetaData.schema';
import {
  Empty,
  Id,
  PictureWithoutData,
  SensorData,
  SensorDataArray,
  SensorDataCreationWithoutPictureData,
} from './service-types/types/proto/shared';
import { Picture } from './schema/Picture.schema';

@Injectable()
export class MongoDBService {
  private readonly logger = new Logger(MongoDBService.name);

  constructor(
    @InjectModel(MetaData.name)
    private readonly sensorDataModel: Model<SensorData>,
    @InjectModel(Picture.name)
    private readonly pictureModel: Model<Picture>,
  ) {}

  async findAll(): Promise<SensorDataArray> {
    this.logger.log('Finding all sensor data');

    const data = { sensorData: await this.sensorDataModel.find() };

    return data;
  }

  async findOne(id: string): Promise<SensorData> {
    this.logger.log(`Finding sensor data with id ${id}`);

    const data = await this.sensorDataModel.findById(id);
    if (!data) {
      throw new NotFoundException(`MetaData with id ${id} not found`);
    }

    return data;
  }

  async findOnePicture(id: string): Promise<PictureWithoutData> {
    this.logger.log(`Finding picture with id ${id}`);

    const data = await this.pictureModel.findById(id);
    if (!data) {
      throw new NotFoundException(`Picture with id ${id} not found`);
    }

    return data;
  }

  async createOne(
    data: SensorDataCreationWithoutPictureData,
  ): Promise<SensorData> {
    this.logger.log(`Creating sensor data: ${JSON.stringify(data)}`);

    const response = await this.sensorDataModel.create(data);

    return response;
  }

  async deleteOne(id: string): Promise<Empty> {
    this.logger.log(`Deleting sensor data with id ${id}`);

    const data = await this.sensorDataModel.findByIdAndRemove(id);
    if (!data) {
      throw new NotFoundException(`MetaData with id ${id} not found`);
    }

    return {};
  }
}
