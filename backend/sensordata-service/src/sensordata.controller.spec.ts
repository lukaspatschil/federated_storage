import { Test, TestingModule } from '@nestjs/testing';
import { SensordataController } from './sensordata.controller';
import { SensordataService } from './sensordata.service';

describe('AppController', () => {
  let appController: SensordataController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SensordataController],
      providers: [SensordataService],
    }).compile();

    appController = app.get<SensordataController>(SensordataController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      //expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
