import { Module } from '@nestjs/common';
import { MongoDBController } from './mongodb.controller';
import { MongoDBService } from './mongodb.service';

@Module({
  imports: [],
  controllers: [MongoDBController],
  providers: [MongoDBService],
})
export class MongoDBModule {}
