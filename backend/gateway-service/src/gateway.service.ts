import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UpdateSensorDataDto } from './dto/sensordata/UpdateSensorData.dto';
import { PictureDto } from './dto/picture/Picture.dto';
import { CreateSensorDataDto } from './dto/sensordata/CreateSensorData.dto';
import { Replica } from './service-types/types';
import { SensorDataServiceClient } from './service-types/types/proto/sensorData';
import {
  SensorDataCreation,
  SensorDataUpdate,
} from './service-types/types/proto/shared';

@Injectable()
export class GatewayService {
  private readonly logger = new Logger(GatewayService.name);

  private sensorDataService: SensorDataServiceClient;

  constructor(@Inject('SENSORDATA_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.sensorDataService =
      this.client.getService<SensorDataServiceClient>('SensorDataService');
  }

  createOneSensorData(sensordata: CreateSensorDataDto) {
    this.myLogger('createOneSensorData', 'start');

    const sensorDataEntity: SensorDataCreation = {
      picture: {
        mimetype: sensordata.picture.mimetype,
        data: Buffer.from(sensordata.picture.data, 'base64'),
      },
      metadata: {
        name: sensordata.metadata.name,
        placeIdent: sensordata.metadata.placeIdent,
        seqId: sensordata.metadata.seqId,
        datetime: sensordata.metadata.datetime.toISOString(),
        frameNum: sensordata.metadata.frameNum,
        seqNumFrames: sensordata.metadata.seqNumFrames,
        filename: sensordata.metadata.filename,
        deviceID: sensordata.metadata.deviceID,
        location: sensordata.metadata.location,
      },
    };

    const data = this.sensorDataService.createSensorData(sensorDataEntity);
    this.myLogger(
      'createOneSensorData',
      'finished - data: ' + JSON.stringify(data),
    );
    return data;
  }

  readOneSensorDataById(params) {
    this.myLogger(
      'readOneSensorDataById',
      'start - inputData:' + JSON.stringify(params),
    );
    const data = this.sensorDataService.getSensorDataById({ id: params.id });
    this.myLogger(
      'readOneSensorDataById',
      'finished - data: ' + JSON.stringify(data),
    );
    return data;
  }

  async getAllSensorData() {
    this.myLogger('getAllSensorData', 'start');
    const res = await firstValueFrom(
      this.sensorDataService.getAllSensorData({}),
    );
    if (res.sensorData === undefined) {
      this.logger.log(
        'Gateway getAllSensorData - object is empty, returning empty list',
      );
      return [];
    }
    this.myLogger('getAllSensorData', 'finished');
    return res.sensorData;
  }

  async readPictureEndpointById(params) {
    this.myLogger(
      'readPictureEndpointById',
      'start - inputData:' + JSON.stringify(params),
    );
    const picture = await firstValueFrom(
      this.sensorDataService.getPictureById({ id: params.id }),
    );
    const pictureDto: PictureDto = {
      id: picture.id,
      data: picture.data.toString('base64'),
      mimetype: picture.mimetype,
      createdAt: picture.createdAt,
      replica: picture.replica as Replica,
    };
    this.myLogger('readPictureEndpointById', 'finished');
    return pictureDto;
  }

  deleteOnePictureById(params) {
    this.myLogger(
      'deleteOnePictureById',
      'start - inputData:' + JSON.stringify(params),
    );
    const data = this.sensorDataService.removeSensorDataById({ id: params.id });
    this.myLogger(
      'deleteOnePictureById',
      'finished - data: ' + JSON.stringify(data),
    );
    return data;
  }

  updateSensorDataById(params, updateSensordataDto: UpdateSensorDataDto) {
    this.myLogger(
      'updateSensorDataById',
      'start - inputData:' +
        JSON.stringify(params) +
        ' - Id: ' +
        JSON.stringify(params.id),
    );
    const updateSensordata: SensorDataUpdate = {
      id: params.id,
      picture: updateSensordataDto?.picture
        ? {
            mimetype: updateSensordataDto.picture.mimetype,
            data: Buffer.from(updateSensordataDto.picture.data, 'base64'),
          }
        : undefined,
      metadata: {
        name: updateSensordataDto?.metadata?.name,
        placeIdent: updateSensordataDto?.metadata?.placeIdent,
        seqId: updateSensordataDto?.metadata?.seqId,
        datetime: updateSensordataDto?.metadata?.datetime
          ? String(updateSensordataDto?.metadata?.datetime)
          : undefined,
        frameNum: updateSensordataDto?.metadata?.frameNum,
        seqNumFrames: updateSensordataDto?.metadata?.seqNumFrames,
        filename: updateSensordataDto?.metadata?.filename,
        deviceID: updateSensordataDto?.metadata?.deviceID,
        location: updateSensordataDto?.metadata?.location,
        tagsWrapper: updateSensordataDto?.metadata?.tags
          ? { tags: updateSensordataDto?.metadata?.tags }
          : undefined,
      },
    };

    this.logger.log(updateSensordata?.metadata?.name);

    const data = this.sensorDataService.updateSensorDataById(updateSensordata);
    this.myLogger(
      'createOneSensorData',
      'finished - data: ' + JSON.stringify(data),
    );
    return data;
  }

  private myLogger(functionname: string, message: string) {
    this.logger.log('GatewayService - ' + functionname + ': ' + message);
  }
}
