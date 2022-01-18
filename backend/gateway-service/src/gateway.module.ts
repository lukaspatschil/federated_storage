import { ClientsModule, Transport } from '@nestjs/microservices';

import { AmqpLoggerModule } from './amqp-logger/amqp-logger.module';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { Module } from '@nestjs/common';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SENSORDATA_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'sensorData',
          protoPath: join(__dirname, '../../proto/sensorData.proto'),
          url: 'sensordata-service:5000',
        },
      },
    ]),
    AmqpLoggerModule,
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
