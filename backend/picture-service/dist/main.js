"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const path_1 = require("path");
const amqp_logger_service_1 = require("./amqp-logger/amqp-logger.service");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        logger: false,
        transport: microservices_1.Transport.GRPC,
        options: {
            package: 'picture',
            protoPath: (0, path_1.join)(__dirname, '../../proto/picture.proto'),
            url: 'picture-service:5000',
        },
    });
    app.useLogger(app.get(amqp_logger_service_1.AmqpLoggerService));
    app.listen();
}
bootstrap();
//# sourceMappingURL=main.js.map