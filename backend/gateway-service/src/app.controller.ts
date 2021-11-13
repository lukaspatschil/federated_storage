import {
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { PictureServiceClient } from './lib';
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

@Controller('api/v1/sensordata')
export class AppController {
  private pictureService: PictureServiceClient;

  constructor(@Inject('PICTURE_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.pictureService =
      this.client.getService<PictureServiceClient>('PictureService');
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
    return null;
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
    console.log(functionname + ' ' + params.id);
    return functionname;
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
  readAllSensorData() {
    const functionname = 'readAllSensorData';
    console.log(functionname);
    return functionname;
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
  readPictureEndpointById(@Param() params) {
    const functionname = 'read picture endpoint by id';
    console.log(functionname + ' ' + params.id);
    return functionname;
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
    return functionname;
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
    return functionname;
  }
}
