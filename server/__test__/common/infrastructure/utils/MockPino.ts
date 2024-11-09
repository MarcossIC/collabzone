import { HttpLogger } from 'pino-http';

import { DEFAULT_UUID } from '../../domain/uuidMock';

export const mockPinoLogger = {
  trace: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn(),
  setBindings: jest.fn(),
  bindings: jest.fn().mockReturnValue({ traceId: DEFAULT_UUID }),
};

export const mockHttpLogger = {
  logger: mockPinoLogger,
} as unknown as HttpLogger;
