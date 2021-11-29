import { Observable } from "rxjs";
export declare const protobufPackage = "minio";
export interface PictureById {
    id: number;
}
export interface Picture {
    id: number;
    name: string;
}
export declare const MINIO_PACKAGE_NAME = "minio";
export interface MinIOServiceClient {
    findOne(request: PictureById): Observable<Picture>;
}
export interface MinIOServiceController {
    findOne(request: PictureById): Promise<Picture> | Observable<Picture> | Picture;
}
export declare function MinIOServiceControllerMethods(): (constructor: Function) => void;
export declare const MIN_IO_SERVICE_NAME = "MinIOService";
