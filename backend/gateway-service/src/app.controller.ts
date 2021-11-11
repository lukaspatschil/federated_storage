import {
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PictureServiceClient } from './lib';

@Controller('api/v1/picture')
export class AppController {
  private pictureService: PictureServiceClient;

  constructor(
    @Inject('PICTURE_PACKAGE') private client: ClientGrpc,
    @Inject('LOGGER_SERVICE') private logger: ClientProxy,
  ) {}

  onModuleInit() {
    this.pictureService =
      this.client.getService<PictureServiceClient>('PictureService');

    this.logger.connect();
  }

  @Get()
  getPicture(): Observable<{ id: number; name: string }> {
    console.log('test');
    const logMessage = {
      message: 'This is a log message1111!',
      date: new Date().toISOString(),
      level: 'LOG',
    };

    this.logger.emit({ cmd: 'log' }, logMessage);

    return this.pictureService.findOne({ id: 1 });
  }

  @Post()
  createOnePicture() {
    const functionname = 'Create one Picture';
    console.log(functionname);
    return functionname;
  }

  @Get('/metadata/:id')
  readOnePictureMetadataById(@Param() params) {
    const functionname = 'read one picture metadata by id';
    console.log(functionname + ' ' + params.id);
    return functionname;
  }

  @Get('/file/:id')
  readPictureEndpointById(@Param() params) {
    const functionname = 'read picture endpoint by id';
    console.log(functionname + ' ' + params.id);
    return functionname;
  }

  @Put('/metadata/:id')
  updatePictureMetadataById(@Param() params) {
    const functionname = 'update picture metadata by id';
    console.log(functionname + ' ' + params.id);
    return functionname;
  }

  @Put('/file/:id')
  updateOnePictureById(@Param() params) {
    const functionname = 'update one picture by id';
    console.log(functionname + ' ' + params.id);
    return functionname;
  }

  @Delete('/:id')
  deleteOnePictureById(@Param() params) {
    const functionname = 'delete one picture by id';
    console.log(functionname + ' ' + params.id);
    return functionname;
  }

  @Get('/ids')
  getAllIds() {
    const functionname = 'get all ids';
    console.log(functionname);
    return functionname;
  }
}
