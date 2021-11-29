import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Picture, PictureById } from './lib';
export declare class AppController {
    private minioClient;
    private dropboxClient;
    private mongodbClient;
    private minIOService;
    private dropboxService;
    private mongodbService;
    constructor(minioClient: ClientGrpc, dropboxClient: ClientGrpc, mongodbClient: ClientGrpc);
    onModuleInit(): void;
    findOne(data: PictureById, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Observable<Picture>>;
}
