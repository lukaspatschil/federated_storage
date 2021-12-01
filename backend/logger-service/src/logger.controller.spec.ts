import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';
import { LogEntry, LOG_LEVEL } from './service-types/types';

describe('LoggerController', () => {
  let loggerController: LoggerController;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [LoggerController],
      providers: [LoggerService],
    }).compile();

    loggerController = app.get<LoggerController>(LoggerController);
    loggerService = app.get<LoggerService>(LoggerService);
  });

  describe(LoggerController.name, () => {
    it('should call the logger service with a log message', () => {
      // Given
      const logMessage: LogEntry = {
        message: 'test',
        date: new Date().toISOString(),
        level: LOG_LEVEL.LOG,
        serviceName: 'TestService',
      };
      jest.spyOn(loggerService, 'writeToFile').mockImplementation((x) => {});

      // When
      loggerController.log(logMessage);

      // Then
      expect(loggerService.writeToFile).toHaveBeenCalledWith(logMessage);
    });
  });
});
