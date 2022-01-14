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
  private readonly logger = new Logger(GatewayService.name);

  private sensorDataService: SensorDataServiceClient;

  constructor(@Inject('SENSORDATA_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.sensorDataService =
        this.client.getService<SensorDataServiceClient>('SensorDataService');
  }

  createOneSensorData(sensordata: CreateSensorDataDto) {
    this.myLogger("createOneSensorData", "start")

    const sensorDataEntity: SensorDataCreation = {
      picture: {
        mimetype: sensordata.picture.mimetype,
        data: Buffer.from(sensordata.picture.data, 'base64'),
      },
      metadata: {
        name: sensordata.metadata.name,
        placeIdent: sensordata.metadata.placeIdent,
        seqId: sensordata.metadata.seqID,
        datetime: String(sensordata.metadata.datetime),
        frameNum: sensordata.metadata.frameNum,
        seqNumFrames: sensordata.metadata.seqNumFrames,
        filename: sensordata.metadata.filename,
        deviceID: sensordata.metadata.deviceID,
        location: sensordata.metadata.location,
      },
    };

    const data = this.sensorDataService.createSensorData(sensorDataEntity);
    this.myLogger("createOneSensorData", "finished - data: " + JSON.stringify(data))
    return data
  }

  readOneSensorDataById(params) {
    this.myLogger("readOneSensorDataById", "start - inputData:" + JSON.stringify(params))
    const data = this.sensorDataService.getSensorDataById({ id: params.id });
    this.myLogger("readOneSensorDataById", "finished - data: " + JSON.stringify(data))
    return data
  }

  async getAllSensorData() {
    this.myLogger("getAllSensorData", "start")
    const res = await firstValueFrom(
        this.sensorDataService.getAllSensorData({}),
    );
    this.myLogger("getAllSensorData", "finished")
    return res.sensorData;
  }

  async readPictureEndpointById(params) {
    this.myLogger("readPictureEndpointById", "start - inputData:" + JSON.stringify(params))
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
    this.myLogger("readPictureEndpointById", "finished")
    return pictureDto;
  }

  deleteOnePictureById(params) {
    this.myLogger("deleteOnePictureById", "start - inputData:" + JSON.stringify(params))
    const data = this.sensorDataService.removeSensorDataById({ id: params.id });
    this.myLogger("deleteOnePictureById", "finished - data: " + JSON.stringify(data))
    return data
  }

  updateSensorDataById(params, metadata: MetadataDto) {
    this.myLogger("updateSensorDataById", "start - inputData:" + JSON.stringify(params) + " - Metadata: " + JSON.stringify(metadata))
    //this.myLogger("deleteOnePictureById", "finished - data: " + JSON.stringify(data))
  }

  private myLogger(functionname: String, message: String){
    this.logger.log("GatewayService - " + functionname + ": " + message)
  }
}
