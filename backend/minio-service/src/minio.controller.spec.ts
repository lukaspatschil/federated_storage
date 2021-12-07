import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { Observable } from 'rxjs';
import { MinioController } from './minio.controller';
import { MinioService } from './minio.service';
import {
  PictureCreationById,
  PictureData,
} from './service-types/types/proto/shared';

describe('MinioController', () => {
  let minioController: MinioController;
  let minioService: MinioService;

  beforeEach(async () => {
    const minio: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [MinioController],
      providers: [MinioService],
    }).compile();

    minioController = minio.get<MinioController>(MinioController);
    minioService = minio.get<MinioService>(MinioService);
  });

  describe(MinioController.name, () => {
    describe('removePictureById', () => {
      it('should return an empty observable', () => {
        // Given
        const request = {
          id: '1',
        };
        const responseValue = new Observable<any>();

        jest
          .spyOn(minioService, 'removePictureById')
          .mockImplementation((x) => responseValue);

        // When
        const response = minioController.removePictureById(request);

        // Then
        expect(response).toBe(responseValue);
      });
    });
    describe('getPictureById', () => {
      it('should return an PictureData observable', () => {
        // Given
        const request = {
          id: '1',
        };
        const responseValue = new Observable<PictureData>();

        jest
          .spyOn(minioService, 'getPictureById')
          .mockImplementation((x) => responseValue);

        // When
        const response = minioController.getPictureById(request);

        // Then
        expect(response).toBe(responseValue);
      });
    });
    describe('createPictureById', () => {
      it('should return an an empty observable', () => {
        // Given
        const request = new Observable<PictureCreationById>((observer) => {
          observer.next({
            id: '1',
            mimetype: 'text/lol',
            data: Buffer.from('RGFzIGlzdCBlaW4gdGVzdA==', 'base64'),
          });
        });
        const responseValue = new Observable<any>();

        jest
          .spyOn(minioService, 'createPictureById')
          .mockImplementation((x) => responseValue);

        // When
        const response = minioController.createPictureById(request);

        // Then
        expect(response).toBe(responseValue);
      });
    });
  });
});
