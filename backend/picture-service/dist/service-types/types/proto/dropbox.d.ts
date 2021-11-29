import { Observable } from "rxjs";
export declare const protobufPackage = "dropbox";
export interface PictureById {
    id: number;
}
export interface Picture {
    id: number;
    name: string;
}
export declare const DROPBOX_PACKAGE_NAME = "dropbox";
export interface DropboxServiceClient {
    findOne(request: PictureById): Observable<Picture>;
}
export interface DropboxServiceController {
    findOne(request: PictureById): Promise<Picture> | Observable<Picture> | Picture;
}
export declare function DropboxServiceControllerMethods(): (constructor: Function) => void;
export declare const DROPBOX_SERVICE_NAME = "DropboxService";
