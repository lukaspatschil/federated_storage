import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AmqpLoggerModule } from './amqp-logger/amqp-logger.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PICTURE_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'picture',
          protoPath: join(__dirname, '../../proto/picture.proto'),
          url: 'picture-service:5000',
        },
      },
    ]),
    AmqpLoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
