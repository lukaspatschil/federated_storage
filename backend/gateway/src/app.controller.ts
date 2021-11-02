import { Controller, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/v1/picture')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /*@Get()
  getHello(): string {
    return this.appService.getHello();
  }*/

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
