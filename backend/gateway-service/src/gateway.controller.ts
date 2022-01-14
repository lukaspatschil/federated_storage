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
import { GatewayService } from './gateway.service';

@Controller('api/v1/sensordata')
export class GatewayController {
  private readonly logger = new Logger('gateway-service');

  constructor(private readonly gatewayService: GatewayService) {}

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
  createOneSensorData(@Body() sensordata: CreateSensorDataDto) {
    this.myLogger("createOneSensorData", "start - Params: " + JSON.stringify(sensordata))
    const data = this.gatewayService.createOneSensorData(sensordata)
    this.myLogger("createOneSensorData", "finished - data: " + JSON.stringify(data))
    return data
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
    this.myLogger("readOneSensorDataById", "start - Params: " + JSON.stringify(params))
    const data = this.gatewayService.readOneSensorDataById(params);
    this.myLogger("readOneSensorDataById", "finished - data: " + JSON.stringify(params))
    return data
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
    this.myLogger("getAllSensorData", "start")
    return this.gatewayService.getAllSensorData();
    this.myLogger("getAllSensorData", "finished")
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
    this.myLogger("readPictureEndpointById", "start - Params: " + JSON.stringify(params))
    const data = this.gatewayService.readPictureEndpointById(params)
    this.myLogger("readPictureEndpointById", "finished - data: " + JSON.stringify(data))
    return data
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
    this.myLogger("deleteOnePictureById", "start - Params: " + JSON.stringify(params))
    const data = this.gatewayService.deleteOnePictureById(params)
    this.myLogger("deleteOnePictureById", "finished - data:" + JSON.stringify(data))
    return data
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
    this.myLogger("updateSensorDataById", "start - Params: " + JSON.stringify(params) + "Metadata: " + JSON.stringify(metadata))
    const data = this.gatewayService.updateSensorDataById(params, metadata)
    this.myLogger("updateSensorDataById", "finished - data: " + JSON.stringify(data))
    return data
  }


  private myLogger(functionname: String, message: String){
    this.logger.log("GatewayController - " + functionname + ": " + message)
  }

}
