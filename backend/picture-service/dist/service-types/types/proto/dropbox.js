"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DROPBOX_SERVICE_NAME = exports.DropboxServiceControllerMethods = exports.DROPBOX_PACKAGE_NAME = exports.protobufPackage = void 0;
const microservices_1 = require("@nestjs/microservices");
const minimal_1 = require("protobufjs/minimal");
const Long = require("long");
exports.protobufPackage = "dropbox";
exports.DROPBOX_PACKAGE_NAME = "dropbox";
function DropboxServiceControllerMethods() {
    return function (constructor) {
        const grpcMethods = ["findOne"];
        for (const method of grpcMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcMethod)("DropboxService", method)(constructor.prototype[method], method, descriptor);
        }
        const grpcStreamMethods = [];
        for (const method of grpcStreamMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcStreamMethod)("DropboxService", method)(constructor.prototype[method], method, descriptor);
        }
    };
}
exports.DropboxServiceControllerMethods = DropboxServiceControllerMethods;
exports.DROPBOX_SERVICE_NAME = "DropboxService";
if (minimal_1.util.Long !== Long) {
    minimal_1.util.Long = Long;
    (0, minimal_1.configure)();
}
//# sourceMappingURL=dropbox.js.map