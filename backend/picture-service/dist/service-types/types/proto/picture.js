"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PICTURE_SERVICE_NAME = exports.PictureServiceControllerMethods = exports.PICTURE_PACKAGE_NAME = exports.protobufPackage = void 0;
const microservices_1 = require("@nestjs/microservices");
const minimal_1 = require("protobufjs/minimal");
const Long = require("long");
exports.protobufPackage = "picture";
exports.PICTURE_PACKAGE_NAME = "picture";
function PictureServiceControllerMethods() {
    return function (constructor) {
        const grpcMethods = ["findOne"];
        for (const method of grpcMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcMethod)("PictureService", method)(constructor.prototype[method], method, descriptor);
        }
        const grpcStreamMethods = [];
        for (const method of grpcStreamMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcStreamMethod)("PictureService", method)(constructor.prototype[method], method, descriptor);
        }
    };
}
exports.PictureServiceControllerMethods = PictureServiceControllerMethods;
exports.PICTURE_SERVICE_NAME = "PictureService";
if (minimal_1.util.Long !== Long) {
    minimal_1.util.Long = Long;
    (0, minimal_1.configure)();
}
//# sourceMappingURL=picture.js.map