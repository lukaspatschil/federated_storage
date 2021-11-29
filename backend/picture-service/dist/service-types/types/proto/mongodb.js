"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGO_DB_SERVICE_NAME = exports.MongoDBServiceControllerMethods = exports.MONGODB_PACKAGE_NAME = exports.protobufPackage = void 0;
const microservices_1 = require("@nestjs/microservices");
const minimal_1 = require("protobufjs/minimal");
const Long = require("long");
exports.protobufPackage = "mongodb";
exports.MONGODB_PACKAGE_NAME = "mongodb";
function MongoDBServiceControllerMethods() {
    return function (constructor) {
        const grpcMethods = ["findOne"];
        for (const method of grpcMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcMethod)("MongoDBService", method)(constructor.prototype[method], method, descriptor);
        }
        const grpcStreamMethods = [];
        for (const method of grpcStreamMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcStreamMethod)("MongoDBService", method)(constructor.prototype[method], method, descriptor);
        }
    };
}
exports.MongoDBServiceControllerMethods = MongoDBServiceControllerMethods;
exports.MONGO_DB_SERVICE_NAME = "MongoDBService";
if (minimal_1.util.Long !== Long) {
    minimal_1.util.Long = Long;
    (0, minimal_1.configure)();
}
//# sourceMappingURL=mongodb.js.map