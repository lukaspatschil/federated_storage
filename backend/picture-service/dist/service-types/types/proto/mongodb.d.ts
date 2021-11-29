import { Observable } from "rxjs";
export declare const protobufPackage = "mongodb";
export interface PictureById {
    id: number;
}
export interface Picture {
    id: number;
    name: string;
}
export declare const MONGODB_PACKAGE_NAME = "mongodb";
export interface MongoDBServiceClient {
    findOne(request: PictureById): Observable<Picture>;
}
export interface MongoDBServiceController {
    findOne(request: PictureById): Promise<Picture> | Observable<Picture> | Picture;
}
export declare function MongoDBServiceControllerMethods(): (constructor: Function) => void;
export declare const MONGO_DB_SERVICE_NAME = "MongoDBService";
