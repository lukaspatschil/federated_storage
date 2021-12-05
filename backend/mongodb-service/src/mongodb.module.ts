import { Module } from '@nestjs/common';
import { MongoDBController } from './mongodb.controller';
import { MongoDBService } from './mongodb.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SensorData } from './schema/SensorData.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('MONGO_USER')}:${configService.get(
          'MONGO_PASSWORD',
        )}@${configService.get('MONGO_HOST')}:${configService.get(
          'MONGO_PORT',
        )}`,
        dbName: configService.get('MONGO_DB'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: SensorData.name, schema: SensorData }]),
  ],
  controllers: [MongoDBController],
  providers: [MongoDBService],
})
export class MongoDBModule {}
