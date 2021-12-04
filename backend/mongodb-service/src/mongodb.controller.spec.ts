import { Test, TestingModule } from '@nestjs/testing';
import { MongoDBController } from './mongodb.controller';
import { MongoDBService } from './mongodb.service';

describe('AppController', () => {
  let appController: MongoDBController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MongoDBController],
      providers: [MongoDBService],
    }).compile();

    appController = app.get<MongoDBController>(MongoDBController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
