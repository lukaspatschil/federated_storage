"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmqpLoggerModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const amqp_logger_service_1 = require("./amqp-logger.service");
let AmqpLoggerModule = class AmqpLoggerModule {
};
AmqpLoggerModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot()],
        providers: [
            {
                provide: 'LOGGER_SERVICE',
                useFactory: (configService) => {
                    const rabbitmqOptions = {
                        transport: microservices_1.Transport.RMQ,
                        options: {
                            urls: [
                                `amqp://${configService.get('RABBITMQ_USERNAME')}:${configService.get('RABBITMQ_PASSWORD')}@${configService.get('RABBITMQ_URL')}:${configService.get('RABBITMQ_PORT')}`,
                            ],
                            queue: 'logger_queue',
                            queueOptions: {
                                durable: false,
                            },
                        },
                    };
                    return microservices_1.ClientProxyFactory.create(rabbitmqOptions);
                },
                inject: [config_1.ConfigService],
            },
            amqp_logger_service_1.AmqpLoggerService,
        ],
        exports: [amqp_logger_service_1.AmqpLoggerService],
    })
], AmqpLoggerModule);
exports.AmqpLoggerModule = AmqpLoggerModule;
//# sourceMappingURL=amqp-logger.module.js.map