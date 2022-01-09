import {
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Logger,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MetadataDto } from './dto/metadata/Metadata.dto';
import { SensorDataDto } from './dto/sensordata/SensorData.dto';
import { CreateSensorDataDto } from './dto/sensordata/CreateSensorData.dto';
import { PictureDto } from './dto/picture/Picture.dto';
import { UpdateSensorDataDto } from './dto/sensordata/UpdateSensorData.dto';
import { SensorDataServiceClient } from './service-types/types/proto/sensorData';
import { firstValueFrom, of } from 'rxjs';
import { SensorDataCreation } from './service-types/types/proto/shared';
import { Replica } from './service-types/types';

@Controller('api/v1/sensordata')
export class AppController {
  private readonly logger = new Logger('gateway-service');

  private sensorDataService: SensorDataServiceClient;

  constructor(@Inject('SENSORDATA_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.sensorDataService =
      this.client.getService<SensorDataServiceClient>('SensorDataService');
  }

  @Post()
  @ApiTags('Storage')
  @ApiOperation({ summary: 'create one sensordata entry' })
  @ApiCreatedResponse({
    description: 'Created',
    type: null,
  })
  @ApiBadRequestResponse({
    description: 'Validation Error',
    type: String,
  })
  @ApiUnauthorizedResponse({
    description: 'wrong API key',
    type: String,
  })
  CreateOneSensorData(@Body() sensordata: CreateSensorDataDto) {
    //const functionname = 'CreateOneSensorData';
    //console.log(functionname + ': ' + JSON.stringify(sensordata));
    //return functionname;

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

  @Get('/:id')
  @ApiTags('Storage')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of the sensordata',
    type: String,
  })
  @ApiOperation({
    summary: 'get sensordata by ID',
  })
  @ApiOkResponse({
    description: 'Successful Operation',
    type: SensorDataDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation Error',
    type: String,
  })
  @ApiUnauthorizedResponse({
    description: 'wrong API key',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'ID not found',
    type: String,
  })
  readOneSensorDataById(@Param() params) {
    const functionname = 'readOneSensorDataById';
    this.logger.log(functionname + ' ' + params.id);
    return this.sensorDataService.getSensorDataById({ id: params.id });
  }

  @Get()
  @ApiTags('Storage')
  @ApiOperation({
    summary: 'get all sensordata',
  })
  @ApiOkResponse({
    description: 'get all sensorData',
    type: SensorDataDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'wrong API key',
    type: String,
  })
  async getAllSensorData() {
    this.logger.log('getAllSensorData()');
    const res = await firstValueFrom(
      this.sensorDataService.getAllSensorData({}),
    );
    return res.sensorData;
  }

  @Get('/picture/:id')
  @ApiTags('Storage')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'integer for the image id',
    type: String,
  })
  @ApiOperation({
    summary: 'get picture by id',
  })
  @ApiOkResponse({
    description: 'Successful Operation',
    type: PictureDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: String,
  })
  @ApiUnauthorizedResponse({
    description: 'wrong API key',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'ID not found',
    type: String,
  })
  async readPictureEndpointById(@Param() params) {
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

  @Delete('/:id')
  @ApiTags('Storage')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'integer for the image id',
    type: String,
  })
  @ApiOperation({
    summary: 'delete one sensorData by id',
  })
  @ApiOkResponse({
    description: 'Successful Operation',
    type: null,
  })
  @ApiBadRequestResponse({
    description: 'Validation Error',
    type: String,
  })
  @ApiUnauthorizedResponse({
    description: 'wrong API key',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'ID not found',
    type: String,
  })
  deleteOnePictureById(@Param() params) {
    const functionname = 'delete one picture entry by id';
    console.log(functionname + ' ' + params.id);
    return this.sensorDataService.removeSensorDataById({ id: params.id });
  }

  @Put('/:id')
  @ApiTags('Storage')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'id of sensordata',
    type: String,
  })
  @ApiBody({ type: UpdateSensorDataDto })
  @ApiOperation({
    summary: 'update sensordata by id',
  })
  @ApiOkResponse({
    description: 'Successful Operation',
    type: null,
  })
  @ApiBadRequestResponse({
    description: 'Validation Error',
    type: String,
  })
  @ApiUnauthorizedResponse({
    description: 'wrong API key',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'ID not found',
    type: String,
  })
  updateSensorDataById(@Param() params, @Body() metadata: MetadataDto) {
    const functionname = 'update picture metadata by id';
    console.log(functionname + ' ' + params.id);
  }
}
