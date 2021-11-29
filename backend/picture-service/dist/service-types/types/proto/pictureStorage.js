"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PICTURE_STORAGE_SERVICE_NAME = exports.PictureStorageServiceControllerMethods = exports.PICTURE_STORAGE_PACKAGE_NAME = exports.protobufPackage = void 0;
const microservices_1 = require("@nestjs/microservices");
const minimal_1 = require("protobufjs/minimal");
const Long = require("long");
exports.protobufPackage = "pictureStorage";
exports.PICTURE_STORAGE_PACKAGE_NAME = "pictureStorage";
function PictureStorageServiceControllerMethods() {
    return function (constructor) {
        const grpcMethods = ["getPictureById", "removePictureById"];
        for (const method of grpcMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcMethod)("PictureStorageService", method)(constructor.prototype[method], method, descriptor);
        }
        const grpcStreamMethods = ["createPictureById"];
        for (const method of grpcStreamMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcStreamMethod)("PictureStorageService", method)(constructor.prototype[method], method, descriptor);
        }
    };
}
exports.PictureStorageServiceControllerMethods = PictureStorageServiceControllerMethods;
exports.PICTURE_STORAGE_SERVICE_NAME = "PictureStorageService";
if (minimal_1.util.Long !== Long) {
    minimal_1.util.Long = Long;
    (0, minimal_1.configure)();
}
//# sourceMappingURL=pictureStorage.js.map