import { Controller, Get, Inject, Post, Put, Delete, Param } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PictureServiceClient } from './interfaces/picture.interface';

@Controller('api/v1/picture')
export class AppController {
  private pictureService: PictureServiceClient;

  constructor(@Inject('PICTURE_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.pictureService =
      this.client.getService<PictureServiceClient>('PictureService');
  }

  @Get()
  getPicture(): Observable<{ id: number; name: string }> {
    return this.pictureService.findOne({ id: 1 });

  @Post()
  createOnePicture() {
    var functionname = 'Create one Picture';
    console.log(functionname);
    return functionname;
  }

  @Get('/metadata/:id')
  readOnePictureMetadataById(@Param() params) {
    var functionname = 'read one picture metadata by id';
    console.log(functionname + " " + params.id);
    return functionname;
  }

  @Get('/file/:id')
  readPictureEndpointById(@Param() params) {
    var functionname = 'read picture endpoint by id';
    console.log(functionname + " " + params.id);
    return functionname;
  }

  @Put('/metadata/:id')
  updatePictureMetadataById(@Param() params) {
    var functionname = 'update picture metadata by id';
    console.log(functionname + " " + params.id);
    return functionname;
  }

  @Put('/file/:id')
  updateOnePictureById(@Param() params) {
    var functionname = 'update one picture by id';
    console.log(functionname + " " + params.id);
    return functionname;
  }

  @Delete('/:id')
  deleteOnePictureById(@Param() params) {
    var functionname = 'delete one picture by id';
    console.log(functionname + " " + params.id);
    return functionname;
  }

  @Get('/ids')
  getAllIds() {
    var functionname = 'get all ids';
    console.log(functionname);
    return functionname;
  }

}
