import { Inject, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom, forkJoin } from 'rxjs';
import {
  IdWithMimetype,
  Picture,
  PictureCreationWithoutData,
  PictureWithoutData,
  SensorDataCreationWithoutPictureData,
} from './service-types/types/proto/shared';
import {
  Empty,
  Id,
  SensorDataCreation,
  SensorDataUpdate,
} from './service-types/types/proto/shared';
import { PictureStorageServiceClient } from './service-types/types/proto/pictureStorage';
import { SensorDataStorageServiceClient } from './service-types/types/proto/sensorDataStorage';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import * as crypto from 'crypto';
import { Replica } from './service-types/types';
import { status } from '@grpc/grpc-js';

@Injectable()
export class SensordataService {
  private logger = new Logger(SensordataService.name);

  private pictureStorageM: PictureStorageServiceClient;
  private pictureStorageD: PictureStorageServiceClient;
  private sensorDataStorage: SensorDataStorageServiceClient;

  constructor(
    @Inject('MINIO_PACKAGE') private minioClient: ClientGrpc,
    @Inject('DROPBOX_PACKAGE') private dropboxClient: ClientGrpc,
    @Inject('MONGODB_PACKAGE') private mongodbClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.pictureStorageM =
      this.minioClient.getService<PictureStorageServiceClient>(
        'PictureStorageService',
      );
    this.pictureStorageD =
      this.dropboxClient.getService<PictureStorageServiceClient>(
        'PictureStorageService',
      );
    this.sensorDataStorage =
      this.mongodbClient.getService<SensorDataStorageServiceClient>(
        'SensorDataStorageService',
      );
  }

  async createSensorData(sensorDataCreation: SensorDataCreation) {
    this.logger.log('sensorDataService - createSensorData(): started');

    if (sensorDataCreation.picture === undefined) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'inputData not correctly formed',
      });
    }

    const { data, mimetype } = sensorDataCreation.picture;

    const hash = crypto.createHash('sha256').update(data).digest('hex');

    const pictureWithoutData: PictureCreationWithoutData = {
      mimetype: mimetype,
      hash: hash,
    };
    const sensorData = await firstValueFrom(
      this.sensorDataStorage.createSensorData({
        metadata: sensorDataCreation.metadata,
        picture: pictureWithoutData,
      }),
    );

    // ATTENTION: This may not work with multiple pictures, especially regarding concurrency
    const lastPicture = sensorData.pictures[sensorData.pictures.length - 1];

    this.logger.log(
      'createSensorData(): start saving pictures with id: ' + lastPicture.id,
    );

    const createPictureById = {
      id: lastPicture.id,
      mimetype: pictureWithoutData.mimetype,
      data: data,
    };
    await firstValueFrom(
      forkJoin([
        this.pictureStorageD.createPictureById(createPictureById),
        this.pictureStorageM.createPictureById(createPictureById),
      ]),
    );
    this.logger.log('createSensorData(): finished');
    return sensorData;
  }

  getSensorDataById(request: Id) {
    this.logger.log(`sensorDataService - get sensordata by id: ${request.id}`);
    return this.sensorDataStorage.getSensorDataById(request);
  }

  getAllSensorData() {
    this.logger.log('sensorDataService - get all sensordata');
    return this.sensorDataStorage.getAllSensorData({});
  }

  async getPictureById(request: Id) {
    this.logger.log(`sensorDataService - get picturedata by id: ${request.id}`);

    const pictureWithoutData = await firstValueFrom(
      this.sensorDataStorage.getPictureWithoutDataById(request),
    );

    this.logger.log(
      'sensorDataService - get picturedata by id: fetched picturedata without imagedata',
    );

    const idWithMimetype: IdWithMimetype = {
      id: pictureWithoutData.id,
      mimetype: pictureWithoutData.mimetype,
    };

    const results = await Promise.allSettled([
      firstValueFrom(this.pictureStorageD.getPictureById(idWithMimetype)),
      firstValueFrom(this.pictureStorageM.getPictureById(idWithMimetype)),
    ]);

    const [resultD, resultM] = results;

    this.logger.log(
      'sensorDataService - get picturedata by id: Fetched all data',
    );

    const picture: Picture = {
      id: pictureWithoutData.id,
      createdAt: pictureWithoutData.createdAt,
      mimetype: pictureWithoutData.mimetype,
      data: Buffer.from(''),
      replica: Replica.MISSING,
    };

    if (resultD.status === 'rejected' && resultM.status === 'rejected') {
      //both were rejected
      this.logger.log(
        'sensorDataService - get picturedata by id: Dropbox and MinIO were rejected - Throwing Error and leaving',
      );
      /*throw new RpcException({
        code: status.INTERNAL,
        message: 'error when fetching images',
      });*/
      const pictureData: PictureWithoutData = {
        mimetype: pictureWithoutData.mimetype,
        hash: pictureWithoutData.hash,
        id: pictureWithoutData.id,
        createdAt: pictureWithoutData.createdAt
      }
      const [replicaStatus, data] = await this.tryToGetNextImage(pictureData)

      picture.replica = replicaStatus
      picture.data = data
    } else if (resultD.status === 'rejected' || resultM.status === 'rejected') {
      this.logger.log(
        'sensorDataService - get picturedata by id: Dropbox or MinIO were rejected - try to replicate data',
      );

      if (resultD.status === 'rejected' && resultM.status === 'fulfilled') {
        // dropbox file missing, replace dropbox
        this.logger.log(
          'sensorDataService - get picturedata by id: Dropbox file missing or other error, MinIO ok, replicate Dropbox data',
        );
        this.replicateData(
          pictureWithoutData,
          resultM.value.data,
          this.pictureStorageD,
        );
        picture.data = resultM.value.data;
      } else if (
        resultD.status === 'fulfilled' &&
        resultM.status === 'rejected'
      ) {
        // minIO files missing, replace MinIO
        this.logger.log(
          'sensorDataService - get picturedata by id: MinIO file missing or other error, Dropbox ok, replicate MinIO data',
        );
        this.replicateData(
          pictureWithoutData,
          resultD.value.data,
          this.pictureStorageM,
        );
        picture.data = resultD.value.data;
      }

      picture.replica = Replica.FAULTY;
    } else {
      //both data found
      this.logger.log(
        'SensordataService getPictureById(): found both Dropbox and MinIO data, no error - checking for hash values of the data',
      );

      const pictureDataM = resultM.value;
      const pictureDataD = resultD.value;

      const [replicaStatus, data] = await this.replicate(
        pictureWithoutData,
        pictureDataM.data,
        pictureDataD.data,
      );
      picture.data = data;
      picture.replica = replicaStatus;
    }

    this.logger.log('sensorDataService - get picturedata by id: finished');
    return picture;
  }

  async removeSensorDataById(request: Id) {
    this.logger.log(
      `sensorDataService - remove sensordata by id: ${request.id}`,
    );

    const sensordata = await firstValueFrom(
      this.sensorDataStorage.getSensorDataById(request),
    );

    const requests: Promise<Empty>[] = [];
    for (const picture of sensordata.pictures) {
      requests.push(
        firstValueFrom(this.pictureStorageD.removePictureById(picture)),
      );
      requests.push(
        firstValueFrom(this.pictureStorageM.removePictureById(picture)),
      );
    }
    await Promise.all(requests);

    await firstValueFrom(this.sensorDataStorage.removeSensorDataById(request));
    return {};
  }

  async updateSensorDataById(sensorDataUpdate: SensorDataUpdate) {
    this.logger.log('updateSensorData(): started');
    // TODO: implement update Method in SensorDataStorage

    let pictureCreationWithoutData: PictureCreationWithoutData | undefined;

    if (sensorDataUpdate.picture !== undefined) {
      const { data, mimetype } = sensorDataUpdate.picture;
      const hash = crypto.createHash('sha256').update(data).digest('hex');
      pictureCreationWithoutData = {
        mimetype: mimetype,
        hash: hash,
      };
    }

    const sensorData = await firstValueFrom(
      this.sensorDataStorage.updateSensorDataById({
        id: sensorDataUpdate.id,
        metadata: sensorDataUpdate?.metadata,
        picture: pictureCreationWithoutData,
      }),
    );

    const lastPicture = sensorData.pictures[sensorData.pictures.length - 1];

    this.logger.log(
      'createSensorData(): start saving pictures with id: ' + lastPicture.id,
    );

    if (
      sensorDataUpdate?.picture?.mimetype !== undefined &&
      sensorDataUpdate.picture?.data !== undefined
    ) {
      const createPictureById = {
        id: lastPicture.id,
        mimetype: sensorDataUpdate?.picture?.mimetype,
        data: sensorDataUpdate.picture?.data,
      };
      await firstValueFrom(
        forkJoin([
          this.pictureStorageD.createPictureById(createPictureById),
          this.pictureStorageM.createPictureById(createPictureById),
        ]),
      );
    }

    this.logger.log('updateSensorData(): finished');
    return sensorData;
  }

  private async replicate(
      pictureData: PictureWithoutData,
      pictureMinio: Buffer,
      pictureDropbox: Buffer,
  ): Promise<[Replica, Buffer]> {
    const hashMinio = crypto
        .createHash('sha256')
        .update(pictureMinio)
        .digest('hex');
    const hashDropbox = crypto
        .createHash('sha256')
        .update(pictureDropbox)
        .digest('hex');

    if (pictureData.hash === hashMinio && pictureData.hash === hashDropbox) {
      this.logger.log(
          'sensorDataService - get picturedata by id: replicate(): Status OK',
      );
      return [Replica.OK, pictureMinio];
    } else if (
        pictureData.hash === hashMinio ||
        pictureData.hash === hashDropbox
    ) {
      // replace faulty image
      this.logger.log(
          'sensorDataService - get picturedata by id: replicate(): images need to be replaced',
      );
      if (pictureData.hash === hashMinio) {
        // replace dropbox
        this.logger.log(
            'sensordata getPictureById() replicate(): Status REPLICATED: Dropbox file faulty',
        );
        this.replicateData(pictureData, pictureMinio, this.pictureStorageD);
        return [Replica.FAULTY, pictureMinio];
      } else {
        // replace Monio
        this.logger.log(
            'sensorDataService - get picturedata by id: replicate(): Status REPLICATED: MinIO file faulty',
        );
        this.replicateData(pictureData, pictureDropbox, this.pictureStorageM);
        return [Replica.FAULTY, pictureDropbox];
      }
    } else {
      // not possible to determine the correct image
      this.logger.log(
          'sensorDataService - get picturedata by id: replicate(): Status MISSING: All files faulty of id: ' + pictureData.id,
      );

      const [state, buf] = await this.tryToGetNextImage(pictureData);

      return [state, buf]

    }
  }

  private async tryToGetNextImage(pictureData: PictureWithoutData): Promise<[Replica, Buffer]> {
    // get next picture data

    this.logger.log("fetching next image " + JSON.stringify(pictureData))

    const nextPicture = await firstValueFrom(this.sensorDataStorage.getNextPictureByIdAndTimestamp({id: pictureData.id}))

    if (nextPicture === undefined) {
      throw new RpcException({
        code: status.DATA_LOSS,
        message: 'not possible to determine former image data',
      });
    }

    this.logger.log("value of next data" + JSON.stringify(nextPicture))

    const picture = await this.getPictureById({id: nextPicture.id})
    return [Replica.MISSING, picture.data]
    /*nextPicture.subscribe(async (res) => {
      this.logger.log("next image id: " + res.id)
      if (res === undefined) {
        this.logger.log("getNextPictureByIdAndTimestamp return is undefined")
        throw new RpcException({
          code: status.INTERNAL,
          message: "Could not find older files"
        })
      } else {
        this.getPictureById({id: res.id}).then((res) => {
              return [Replica.MISSING, res.data]
            }
        )
        const data = await this.getPictureById({id: res.id})
        return [Replica.MISSING, data.data]
      }
    })*/

    /*throw new RpcException({
      code: status.DATA_LOSS,
      message: 'not possible to determine correct image data',
    });*/

  }

  private replicateData(
    pictureData: PictureWithoutData,
    picture: Buffer,
    storage: PictureStorageServiceClient,
  ) {
    const createPictureById = {
      id: pictureData.id,
      mimetype: pictureData.mimetype,
      data: picture,
    };
    storage
      .createPictureById(createPictureById)
      .subscribe((response: Empty) => {
        this.logger.log(
          'sensorDataService - get picturedata by id: replicateData(): finished',
        );
      });
  }
}
