import { Module } from '@nestjs/common';

import { CommonMapper } from './domain/mapper/common.mapper';
import { LoggerService } from './infrastructure/logger/logger.service';
import { ILoggerService } from './infrastructure/logger/logger.adapter';
import { CommonService } from './infrastructure/common.service';
import { CommonServiceAdapter } from './domain/port/common.service.adapter';

@Module({
  providers: [
    CommonMapper,
    {
      provide: ILoggerService,
      useFactory: () => {
        const logger = new LoggerService();
        logger.connect("trace");
        return logger;
      }
    },
    {
      provide: CommonServiceAdapter,
      useClass: CommonService
    }
  ],
  exports: [
    CommonMapper,ILoggerService,CommonServiceAdapter
  ],
})
export class CommonModule {}
