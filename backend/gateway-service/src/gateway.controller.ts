import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Logger,
} from '@nestjs/common';
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
import { SensorDataDto } from './dto/sensordata/SensorData.dto';
import { CreateSensorDataDto } from './dto/sensordata/CreateSensorData.dto';
import { PictureDto } from './dto/picture/Picture.dto';
import { UpdateSensorDataDto } from './dto/sensordata/UpdateSensorData.dto';
import { GatewayService } from './gateway.service';
import { EmptyDto } from './dto/Empty.dto';
import { idDto } from './dto/id.dto';

@Controller('api/v1/sensordata')
export class GatewayController {
  private readonly logger = new Logger(GatewayController.name);

  constructor(private readonly gatewayService: GatewayService) {}

  @Post()
  @ApiTags('Storage')
  @ApiOperation({ summary: 'create one sensordata entry' })
  @ApiCreatedResponse({
    description: 'Created',
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
  createOneSensorData(@Body() sensordata: CreateSensorDataDto) {
    this.myLogger('createOneSensorData', 'start');
    const data = this.gatewayService.createOneSensorData(sensordata);
    this.myLogger(
      'createOneSensorData',
      'finished - data: ' + JSON.stringify(data),
    );
    return data;
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
  readOneSensorDataById(@Param() params: idDto) {
    this.myLogger(
      'readOneSensorDataById',
      'start - Params: ' + JSON.stringify(params),
    );
    const data = this.gatewayService.readOneSensorDataById(params);
    this.myLogger(
      'readOneSensorDataById',
      'finished - data: ' + JSON.stringify(params),
    );
    return data;
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
    this.myLogger('getAllSensorData', 'start');
    return this.gatewayService.getAllSensorData();
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
  async readPictureEndpointById(@Param() params: idDto) {
    this.myLogger(
      'readPictureEndpointById',
      'start - Params: ' + JSON.stringify(params),
    );
    const data = this.gatewayService.readPictureEndpointById(params);
    this.myLogger('readPictureEndpointById', 'finished');
    return data;
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
    type: EmptyDto,
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
  deleteOnePictureById(@Param() params: idDto) {
    this.myLogger(
      'deleteOnePictureById',
      'start - Params: ' + JSON.stringify(params),
    );
    const data = this.gatewayService.deleteOnePictureById(params);
    this.myLogger(
      'deleteOnePictureById',
      'finished - data:' + JSON.stringify(data),
    );
    return data;
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
    type: EmptyDto,
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
  updateSensorDataById(
    @Param() params: idDto,
    @Body() metadata: UpdateSensorDataDto,
  ) {
    this.myLogger(
      'updateSensorDataById',
      'start - Params: ' +
        JSON.stringify(params) +
        ' - Metadata: ' +
        JSON.stringify(metadata),
    );
    const data = this.gatewayService.updateSensorDataById(params, metadata);
    this.myLogger(
      'updateSensorDataById',
      'finished - data: ' + JSON.stringify(data),
    );
    return data;
  }

  private myLogger(functionname: string, message: string) {
    this.logger.log(functionname + ': ' + message);
  }
}
