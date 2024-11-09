import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import pino from 'pino';
import { pinoHttp } from 'pino-http';

import { ILoggerService } from '@/common/domain/port/logger.service';
import { ApiException } from '@/common/domain/types/exception';
import { LoggerService } from '@/common/infrastructure/logger/logger.service.adapter';

import { mockHttpLogger, mockPinoLogger } from './utils/MockPino';

jest.mock('pino');
jest.mock('pino-http');

describe('LoggerService', () => {
  let logger: ILoggerService;

  beforeEach(async () => {
    (pino as jest.MockedFunction<any>).mockReturnValue(mockPinoLogger);
    (pinoHttp as jest.MockedFunction<any>).mockReturnValue(mockHttpLogger);

    const moduleRef = await Test.createTestingModule({
      providers: [{ provide: ILoggerService, useClass: LoggerService }],
    }).compile();

    logger = await moduleRef.resolve<ILoggerService>(ILoggerService);
    logger.pino = mockHttpLogger;
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  describe('setApplication', () => {
    it('debe establecer el nombre de la aplicación', () => {
      logger.setApplication('test-app');
      expect(logger['app']).toBe('test-app');
    });
  });

  describe('connect', () => {
    it('You must initialize the logger with the correct configuration', () => {
      process.env.NODE_ENV = 'development';
      logger.connect('info');

      expect(pino).toHaveBeenCalled();
      expect(pinoHttp).toHaveBeenCalled();
    });
  });

  describe('log methods', () => {
    beforeEach(() => {
      logger.setApplication('test-app');
    });

    it('must log trace message correctly', () => {
      const message = 'test trace message';
      logger.trace({ message });

      expect(mockPinoLogger.trace).toHaveBeenCalled();
      const [logObj] = mockPinoLogger.trace.mock.calls[0];
      expect(logObj.context).toBe('test-app');
      expect(logObj.environment).toBeDefined();
    });

    it('must register message info correctly', () => {
      const message = 'test info message';
      logger.info({ message });

      expect(mockPinoLogger.info).toHaveBeenCalled();
      const [logObj] = mockPinoLogger.info.mock.calls[0];
      expect(logObj.context).toBe('test-app');
      expect(logObj.environment).toBeDefined();
    });

    it('must register message warn correctly', () => {
      const message = 'test warn message';
      logger.warn({ message });

      expect(mockPinoLogger.warn).toHaveBeenCalled();
      const [logObj] = mockPinoLogger.warn.mock.calls[0];
      expect(logObj.context).toBe('test-app');
      expect(logObj.environment).toBeDefined();
    });

    it('must handle ApiException correctly', () => {
      const apiError = new ApiException(
        'test error',
        HttpStatus.BAD_REQUEST,
        'test-context',
      );
      logger.error(apiError);

      expect(mockPinoLogger.error).toHaveBeenCalled();
      const [logObj] = mockPinoLogger.error.mock.calls[0];
      expect(logObj.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(logObj.context).toBe('test-app');
    });
  });

  describe('helper methods', () => {
    it('should be write sensitive headers correctly', () => {
      const headers = {
        authorization: 'Bearer token',
        cookie: 'session=123',
        'content-type': 'application/json',
      };

      const redactedHeaders = logger['redactSensitiveHeaders'](headers);

      expect(redactedHeaders.authorization).toBe('[REDACTED]');
      expect(redactedHeaders.cookie).toBe('[REDACTED]');
      expect(redactedHeaders['content-type']).toBe('application/json');
    });
  });
});
