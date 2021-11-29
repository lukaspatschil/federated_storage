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
exports.AmqpLoggerService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const types_1 = require("../service-types/types");
let AmqpLoggerService = class AmqpLoggerService extends common_1.ConsoleLogger {
    constructor(amqpConnection) {
        super();
        this.amqpConnection = amqpConnection;
        amqpConnection.connect();
    }
    log(message, context, ...optionalParams) {
        super.log(message, context, ...optionalParams);
        this.publishToMQ(message, context, types_1.LOG_LEVEL.LOG);
    }
    error(message, context, ...optionalParams) {
        super.error(message, context, ...optionalParams);
        this.publishToMQ(message, context, types_1.LOG_LEVEL.ERROR);
    }
    warn(message, context, ...optionalParams) {
        super.warn(message, context, ...optionalParams);
        this.publishToMQ(message, context, types_1.LOG_LEVEL.WARN);
    }
    debug(message, context, ...optionalParams) {
        super.debug(message, context, ...optionalParams);
        this.publishToMQ(message, context, types_1.LOG_LEVEL.DEBUG);
    }
    verbose(message, context, ...optionalParams) {
        super.verbose(message, context, ...optionalParams);
        this.publishToMQ(message, context, types_1.LOG_LEVEL.VERBOSE);
    }
    publishToMQ(message, context = '', level) {
        const logMessage = {
            serviceName: context,
            message,
            date: new Date().toISOString(),
            level,
        };
        this.amqpConnection.emit({ cmd: 'log' }, logMessage);
    }
};
AmqpLoggerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('LOGGER_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], AmqpLoggerService);
exports.AmqpLoggerService = AmqpLoggerService;
//# sourceMappingURL=amqp-logger.service.js.map