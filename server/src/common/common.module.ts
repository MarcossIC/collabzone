import { Module } from '@nestjs/common';

import { CommonService } from './domain/port/common.service';
import { ILoggerService } from './domain/port/logger.service';
import { CommonServiceAdapter } from './infrastructure/common.service.adapter';
import { LoggerService } from './infrastructure/logger/logger.service.adapter';

@Module({
  providers: [
    {
      provide: ILoggerService,
      useFactory: () => {
        const logger = new LoggerService();
        logger.connect('trace');
        return logger;
      },
    },
    {
      provide: CommonService,
      useClass: CommonServiceAdapter,
    },
  ],
  exports: [ILoggerService, CommonService],
})
export class CommonModule {}
