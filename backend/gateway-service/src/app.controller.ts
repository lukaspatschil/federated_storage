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
import { PictureServiceClient } from './interfaces/picture.interface';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { MetadataDto } from './dto/metadata/Metadata.dto';
import { ShortPictureDto } from './dto/picture/ShortPicture.dto';
import { SensorDataDto } from './dto/sensordata/sensorData.dto';
import { CreateSensorDataDto } from './dto/sensordata/CreateSensorData.dto';

@Controller('api/v1/picture')
export class AppController {
  private pictureService: PictureServiceClient;

  constructor(@Inject('PICTURE_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.pictureService =
      this.client.getService<PictureServiceClient>('PictureService');
  }

  @Post()
  @ApiTags('Storage')
  @ApiOperation({ summary: 'create one picture and one metadata entry' })
  @ApiCreatedResponse({
    description: 'Created',
    type: SensorDataDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: String,
  })
  createOnePicture(@Body() imageStream: CreateSensorDataDto) {
    const functionname = 'Create one ShortPictureDto';
    console.log(functionname);
    return functionname;
  }

  @Get('/metadata/:id')
  @ApiTags('Storage')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'integer for the image id',
    type: String,
  })
  @ApiOperation({
    summary: 'get metadata of one picture by ID',
  })
  @ApiOkResponse({
    description: 'Successful Operation',
    type: MetadataDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'ID not found',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: String,
  })
  readOnePictureMetadataById(@Param() params) {
    const functionname = 'read one picture metadata by id';
    console.log(functionname + ' ' + params.id);
    return functionname;
  }

  @Get('/file/:id')
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
    type: ShortPictureDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'ID not found',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: String,
  })
  readPictureEndpointById(@Param() params) {
    const functionname = 'read picture endpoint by id';
    console.log(functionname + ' ' + params.id);
    return functionname;
  }

  @Put('/metadata/:id')
  @ApiTags('Storage')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'integer for the image id',
    type: String,
  })
  @ApiBody({ type: MetadataDto })
  @ApiOperation({
    summary: 'update metadata of picture by id',
  })
  @ApiOkResponse({
    description: 'Successful Operation',
    type: MetadataDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'ID not found',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: String,
  })
  updatePictureMetadataById(@Param() params, @Body() metadata: MetadataDto) {
    const functionname = 'update picture metadata by id';
    console.log(functionname + ' ' + params.id);
    return functionname;
  }

  @Put('/file/:id')
  @ApiTags('Storage')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'integer for the image id',
    type: String,
  })
  @ApiOperation({
    summary: 'update picture by id',
  })
  @ApiBody({ type: ShortPictureDto })
  @ApiOkResponse({
    description: 'Successful Operation',
    type: ShortPictureDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'ID not found',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: String,
  })
  updateOnePictureById(@Param() params, @Body() imageStream: string) {
    const functionname = 'update one picture by id';
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
    summary: 'delete one picture and one metadata entry by id',
  })
  @ApiOkResponse({
    description: 'Successful Operation',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'ID not found',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: String,
  })
  deleteOnePictureById(@Param() params) {
    const functionname = 'delete one picture entry by id';
    console.log(functionname + ' ' + params.id);
    return functionname;
  }

  @Get('/ids')
  @ApiTags('Utility')
  @ApiOperation({
    summary: 'get all ids',
  })
  @ApiOkResponse({
    description: 'Successful Operation',
    type: String,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: String,
  })
  getAllIds() {
    const functionname = 'get all ids';
    console.log(functionname);
    return functionname;
  }
}
