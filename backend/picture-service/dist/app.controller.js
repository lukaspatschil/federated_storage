"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const grpc_js_1 = require("@grpc/grpc-js");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let AppController = class AppController {
    constructor(minioClient, dropboxClient, mongodbClient) {
        this.minioClient = minioClient;
        this.dropboxClient = dropboxClient;
        this.mongodbClient = mongodbClient;
    }
    onModuleInit() {
        this.minIOService =
            this.minioClient.getService('MinIOService');
        this.dropboxService =
            this.dropboxClient.getService('DropboxService');
        this.mongodbService =
            this.mongodbClient.getService('MongoDBService');
    }
    async findOne(data, metadata, call) {
        this.dropboxService
            .findOne(data)
            .subscribe(({ id }) => console.log(`The dropbox gets image with ${id}`));
        this.mongodbService
            .findOne(data)
            .subscribe(({ id }) => console.log(`The mongo says ${id}`));
        return this.minIOService.findOne(data);
    }
};
__decorate([
    (0, microservices_1.GrpcMethod)('PictureService', 'FindOne'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, grpc_js_1.Metadata, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "findOne", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)('MINIO_PACKAGE')),
    __param(1, (0, common_1.Inject)('DROPBOX_PACKAGE')),
    __param(2, (0, common_1.Inject)('MONGODB_PACKAGE')),
    __metadata("design:paramtypes", [Object, Object, Object])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map