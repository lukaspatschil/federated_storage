import { Controller, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  PictureStorageServiceController,
  PictureStorageServiceControllerMethods,
} from './service-types/types/proto/pictureStorage';
import {
  PictureCreationById,
  Empty,
  Id,
  PictureData,
} from './service-types/types/proto/shared';
import { MinioService } from './minio.service';

@Controller()
@PictureStorageServiceControllerMethods()
export class MinioController implements PictureStorageServiceController {
  private readonly logger = new Logger(MinioController.name);

  constructor(private readonly minioService: MinioService) {}

  getPictureById(request: Id): Promise<PictureData> {
    return this.minioService.getPictureById(request);
  }

  removePictureById(request: Id): Promise<Empty> {
    return this.minioService.removePictureById(request);
  }

  createPictureById(request: PictureCreationById): Promise<Empty> {
    return this.minioService.createPictureById(request);
  }
}
