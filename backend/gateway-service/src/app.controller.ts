import {
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Delete,
  Param,
  Logger,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PictureServiceClient } from './lib';

@Controller('api/v1/picture')
export class AppController {
  private readonly logger = new Logger('gateway-service');

  private pictureService: PictureServiceClient;

  constructor(@Inject('PICTURE_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.pictureService =
      this.client.getService<PictureServiceClient>('PictureService');
  }

  @Get()
  getPicture(): Observable<{ id: number; name: string }> {
    console.log('test');
    this.logger.log('THis is a message');
    this.logger.warn('This is a warning!');
    this.logger.error('ERRROR');
    this.logger.debug('Debug message');
    this.logger.verbose('verbose message');

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
