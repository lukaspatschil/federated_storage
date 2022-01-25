import { Controller, Logger } from '@nestjs/common';
import {
  PictureStorageServiceController,
  PictureStorageServiceControllerMethods,
} from './service-types/types/proto/pictureStorage';
import {
  IdWithMimetype,
  PictureCreationById,
} from './service-types/types/proto/shared';
import { DropboxService } from './dropbox.service';

@Controller()
@PictureStorageServiceControllerMethods()
export class DropboxController implements PictureStorageServiceController {
  private readonly logger = new Logger(DropboxController.name);

  constructor(private readonly dropboxService: DropboxService) {}

  createPictureById(picture: PictureCreationById) {
    return this.dropboxService.createPictureById(picture);
  }

  async getPictureById(request: IdWithMimetype) {
    return this.dropboxService.getPictureById(request);
  }

  removePictureById(request: IdWithMimetype) {
    return this.dropboxService.removePictureById(request);
  }
}
