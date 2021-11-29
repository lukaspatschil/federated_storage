"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIN_IO_SERVICE_NAME = exports.MinIOServiceControllerMethods = exports.MINIO_PACKAGE_NAME = exports.protobufPackage = void 0;
const microservices_1 = require("@nestjs/microservices");
const minimal_1 = require("protobufjs/minimal");
const Long = require("long");
exports.protobufPackage = "minio";
exports.MINIO_PACKAGE_NAME = "minio";
function MinIOServiceControllerMethods() {
    return function (constructor) {
        const grpcMethods = ["findOne"];
        for (const method of grpcMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcMethod)("MinIOService", method)(constructor.prototype[method], method, descriptor);
        }
        const grpcStreamMethods = [];
        for (const method of grpcStreamMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcStreamMethod)("MinIOService", method)(constructor.prototype[method], method, descriptor);
        }
    };
}
exports.MinIOServiceControllerMethods = MinIOServiceControllerMethods;
exports.MIN_IO_SERVICE_NAME = "MinIOService";
if (minimal_1.util.Long !== Long) {
    minimal_1.util.Long = Long;
    (0, minimal_1.configure)();
}
//# sourceMappingURL=minio.js.map