import { Module } from '@nestjs/common';
import { MongoDBController } from './mongodb.controller';
import { MongoDBService } from './mongodb.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  SensorDataDocument,
  SensorDataSchema,
} from './schema/SensorData.schema';
import { PictureDocument, PictureSchema } from './schema/Picture.schema';
import { AmqpLoggerModule } from './amqp-logger/amqp-logger.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const username = configService.get<string>('MONGO_USER');
        const password = configService.get<string>('MONGO_PASSWORD');
        const host = configService.get<string>('MONGO_HOST');
        const port = configService.get<number>('MONGO_PORT');
        const database = configService.get<string>('MONGO_DB');
        const uri = `mongodb://${username}:${password}@${host}:${port}`;

        const devUri = 'mongodb://root:root@localhost:27017';

        return {
          uri: uri,
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: SensorDataDocument.name, schema: SensorDataSchema },
      { name: PictureDocument.name, schema: PictureSchema },
    ]),
    AmqpLoggerModule,
  ],
  controllers: [MongoDBController],
  providers: [MongoDBService],
})
export class MongoDBModule {}
