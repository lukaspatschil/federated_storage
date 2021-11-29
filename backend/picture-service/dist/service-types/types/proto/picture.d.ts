import { Observable } from "rxjs";
export declare const protobufPackage = "picture";
export interface PictureById {
    id: number;
}
export interface Picture {
    id: number;
    name: string;
}
export declare const PICTURE_PACKAGE_NAME = "picture";
export interface PictureServiceClient {
    findOne(request: PictureById): Observable<Picture>;
}
export interface PictureServiceController {
    findOne(request: PictureById): Promise<Picture> | Observable<Picture> | Picture;
}
export declare function PictureServiceControllerMethods(): (constructor: Function) => void;
export declare const PICTURE_SERVICE_NAME = "PictureService";
