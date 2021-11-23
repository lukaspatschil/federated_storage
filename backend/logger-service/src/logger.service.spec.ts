import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';
import { LogEntry, LOG_LEVEL } from './service-types/types';

describe('LoggerService', () => {
  let sut: LoggerService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [LoggerService],
    }).compile();

    sut = app.get<LoggerService>(LoggerService);
  });

  describe(LoggerController.name, () => {
    it('should do something', () => {
      // Given
      const logMessage: LogEntry = {
        message: 'test',
        date: new Date().toISOString(),
        level: LOG_LEVEL.LOG,
        serviceName: 'TestService',
      };
      jest.mock('fs');
      fs.existsSync = jest.fn();
      fs.existsSync.mockReturnValue(false);
      const appendSync = jest.spyOn(fs, 'appendSync');

      // When
      sut.writeToFile(logMessage);

      // Then
      expect(appendSync).toHaveBeenCalled();
    });
  });
});
