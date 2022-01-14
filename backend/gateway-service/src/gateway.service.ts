import {Inject, Injectable, Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MetadataDto } from './dto/metadata/Metadata.dto';
import { PictureDto } from './dto/picture/Picture.dto';
import { CreateSensorDataDto } from './dto/sensordata/CreateSensorData.dto';
import { Replica } from './service-types/types';
import { SensorDataServiceClient } from './service-types/types/proto/sensorData';
import { SensorDataCreation } from './service-types/types/proto/shared';

@Injectable()
export class GatewayService {
  private readonly logger = new Logger('gateway-service');

  private sensorDataService: SensorDataServiceClient;

  constructor(@Inject('SENSORDATA_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.sensorDataService =
        this.client.getService<SensorDataServiceClient>('SensorDataService');
  }

  createOneSensorData(sensordata: CreateSensorDataDto) {

    const sensorDataEntity: SensorDataCreation = {
      picture: {
        mimetype: sensordata.picture.mimetype,
        data: Buffer.from(sensordata.picture.data, 'base64'),
      },
      metadata: {
        name: sensordata.metadata.name,
        placeIdent: sensordata.metadata.placeIdent,
        seqId: sensordata.metadata.seqID,
        datetime: sensordata.metadata.datetime.toISOString(),
        frameNum: sensordata.metadata.frameNum,
        seqNumFrames: sensordata.metadata.seqNumFrames,
        filename: sensordata.metadata.filename,
        deviceID: sensordata.metadata.deviceID,
        location: sensordata.metadata.location,
      },
    };

    return this.sensorDataService.createSensorData(sensorDataEntity);
  }

  readOneSensorDataById(params) {
    const functionname = 'readOneSensorDataById';
    this.logger.log(functionname + ' ' + params.id);
    return this.sensorDataService.getSensorDataById({ id: params.id });
  }

  async getAllSensorData() {
    this.logger.log('getAllSensorData()');
    const res = await firstValueFrom(
        this.sensorDataService.getAllSensorData({}),
    );
    return res.sensorData;
  }

  async readPictureEndpointById(params) {
    const functionname = 'read picture endpoint by id';
    console.log(functionname + ' ' + params.id);
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
    return pictureDto;
  }

  deleteOnePictureById(params) {
    const functionname = 'delete one picture entry by id';
    console.log(functionname + ' ' + params.id);
    return this.sensorDataService.removeSensorDataById({ id: params.id });
  }

  updateSensorDataById(params, metadata: MetadataDto) {
    const functionname = 'update picture metadata by id';
    console.log(functionname + ' ' + params.id);
  }
}
