import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Input, InputSchema } from './schemas/input';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    MongooseModule.forFeature([{ name: Input.name, schema: InputSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
