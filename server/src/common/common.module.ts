import { Module } from '@nestjs/common';

import { LoggerService } from './infrastructure/logger/logger.service';
import { ILoggerService } from './infrastructure/logger/logger.adapter';
import { CommonServiceAdapter } from './infrastructure/common.service.adapter';
import { CommonService } from './domain/port/common.service';

@Module({
  providers: [
    {
      provide: ILoggerService,
      useFactory: () => {
        const logger = new LoggerService();
        logger.connect("trace");
        return logger;
      }
    },
    {
      provide: CommonService,
      useClass: CommonServiceAdapter
    }
  ],
  exports: [
    ILoggerService,CommonService
  ],
})
export class CommonModule {}
