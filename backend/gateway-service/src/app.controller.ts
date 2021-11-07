import {
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Delete,
  Param, Body,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PictureServiceClient } from './interfaces/picture.interface';
import {
  ApiBadRequestResponse, ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation, ApiParam, ApiTags
} from "@nestjs/swagger";
import {Metadata} from "./DTO/Metadata";
import {Picture} from "./DTO/Picture";

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
  @ApiOperation({summary: 'create one picture entry'})
  @ApiCreatedResponse({
    description: 'Created',
    type: Picture
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: String
  })
  createOnePicture(@Body() imageStream: String) {
    const functionname = 'Create one Picture';
    console.log(functionname);
    return functionname;
  }

  @Get('/metadata/:id')
  @ApiTags('Storage')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'integer for the image id',
    type: String
  })
  @ApiOperation({
    summary: 'get metadata of one picture by ID'
  })
  @ApiOkResponse({
    description: 'Successful Operation',
    type: Metadata
  })
  @ApiBadRequestResponse({
    description:'Bad Request',
    type: String
  })
  @ApiNotFoundResponse({
    description: "ID not found",
    type: String
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
    type: String
  })
  @ApiOperation({
    summary: 'get picture by id'
  })
  @ApiOkResponse({
    description: 'Successful Operation',
    type: Picture
  })
  @ApiBadRequestResponse({
    description:'Bad Request',
    type: String
  })
  @ApiNotFoundResponse({
    description: "ID not found",
    type: String
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
    type: String
  })
  @ApiBody({type: Metadata})
  @ApiOperation({
    summary: 'update metadata of picture by id'
  })
  @ApiOkResponse({
    description: 'Successful Operation',
    type: Metadata
  })
  @ApiBadRequestResponse({
    description:'Bad Request',
    type: String
  })
  @ApiNotFoundResponse({
    description: "ID not found",
    type: String
  })
  updatePictureMetadataById(@Param() params, @Body() metadata: Metadata) {
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
    type: String
  })
  @ApiOperation({
    summary: 'update picture by id'
  })
  @ApiBody({type: Picture})
  @ApiOkResponse({
    description: 'Successful Operation',
    type: Picture
  })
  @ApiBadRequestResponse({
    description:'Bad Request',
    type: String
  })
  @ApiNotFoundResponse({
    description: "ID not found",
    type: String
  })
  updateOnePictureById(@Param() params, @Body() imageStream: String) {
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
    type: String
  })
  @ApiOperation({
    summary: 'delete one picture by id'
  })
  @ApiOkResponse({
    description: 'Successful Operation'
  })
  @ApiBadRequestResponse({
    description:'Bad Request',
    type: String
  })
  @ApiNotFoundResponse({
    description: "ID not found",
    type: String
  })
  deleteOnePictureById(@Param() params) {
    const functionname = 'delete one picture by id';
    console.log(functionname + ' ' + params.id);
    return functionname;
  }

  @Get('/ids')
  @ApiTags('Utility')
  @ApiOperation({
    summary: 'get ids of all pictures'
  })
  @ApiOkResponse({
    description: 'Successful Operation',
    type: String,
    isArray: true,

  })
  @ApiBadRequestResponse({
    description:'Bad Request',
    type: String
  })
  getAllIds() {
    const functionname = 'get all ids';
    console.log(functionname);
    return functionname;
  }
}
