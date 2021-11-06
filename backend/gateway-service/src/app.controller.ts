import {
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Delete,
  Param,
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
import {Metadata} from "./interfaces/metadata";
import {Picture} from "./interfaces/Picture";

@Controller('api/v1/picture')
export class AppController {
  private pictureService: PictureServiceClient;

  constructor(@Inject('PICTURE_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.pictureService =
      this.client.getService<PictureServiceClient>('PictureService');
  }

  /*@Get()
  @ApiTags('Storage')
  @ApiOperation({
    summary: 'get picture from storage'
  })
  @ApiOkResponse({
    description: 'successful operation',
    type: String,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: String
  })
  getPicture(): Observable<{ id: number; name: string }> {
    return this.pictureService.findOne({ id: 1 });
  }*/

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
  createOnePicture() {
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
    type: Number
  })
  @ApiOperation({
    summary: 'get metadata of one picture by ID'
  })
  @ApiOkResponse({
    description: 'successful operation',
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
    type: Number
  })
  @ApiOperation({
    summary: 'get picture by id'
  })
  @ApiOkResponse({
    description: 'successful operation',
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
    type: Number
  })
  @ApiBody({type: Metadata})
  @ApiOperation({
    summary: 'update metadata of picture by id'
  })
  @ApiOkResponse({
    description: 'successful operation',
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
  updatePictureMetadataById(@Param() params) {
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
    type: Number
  })
  @ApiOperation({
    summary: 'update picture by id'
  })
  @ApiBody({type: Picture})
  @ApiOkResponse({
    description: 'successful operation',
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
  updateOnePictureById(@Param() params) {
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
    type: Number
  })
  @ApiOperation({
    summary: 'delete one picture by id'
  })
  @ApiOkResponse({
    description: 'successful operation'
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
    description: 'successful operation',
    type: [Number]
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
