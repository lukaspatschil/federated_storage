import { Observable } from "rxjs";
export declare const protobufPackage = "pictureStorage";
export interface Id {
    id: string;
}
export interface CreatePictureEntity {
    id: string;
    mimeType: string;
    data: Uint8Array;
}
export interface Data {
    data: Uint8Array;
}
export interface Res {
}
export declare const PICTURE_STORAGE_PACKAGE_NAME = "pictureStorage";
export interface PictureStorageServiceClient {
    getPictureById(request: Id): Observable<Data>;
    createPictureById(request: Observable<CreatePictureEntity>): Observable<Res>;
    removePictureById(request: Id): Observable<Res>;
}
export interface PictureStorageServiceController {
    getPictureById(request: Id): Observable<Data>;
    createPictureById(request: Observable<CreatePictureEntity>): Promise<Res> | Observable<Res> | Res;
    removePictureById(request: Id): Promise<Res> | Observable<Res> | Res;
}
export declare function PictureStorageServiceControllerMethods(): (constructor: Function) => void;
export declare const PICTURE_STORAGE_SERVICE_NAME = "PictureStorageService";
