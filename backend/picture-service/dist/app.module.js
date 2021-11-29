"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const microservices_1 = require("@nestjs/microservices");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'MINIO_PACKAGE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'pictureStorage',
                        protoPath: (0, path_1.join)(__dirname, '../../proto/pictureStorage.proto'),
                        url: 'minio-service:5000',
                    },
                },
            ]),
            microservices_1.ClientsModule.register([
                {
                    name: 'DROPBOX_PACKAGE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'pictureStorage',
                        protoPath: (0, path_1.join)(__dirname, '../../proto/pictureStorage.proto'),
                        url: 'dropbox-service:5000',
                    },
                },
            ]),
            microservices_1.ClientsModule.register([
                {
                    name: 'MONGODB_PACKAGE',
                    transport: microservices_1.Transport.GRPC,
                    options: {
                        package: 'mongodb',
                        protoPath: (0, path_1.join)(__dirname, '../../proto/mongodb.proto'),
                        url: 'mongodb-service:5000',
                    },
                },
            ]),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map