import {
  HttpStatus,
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { ILoggerService } from './common/domain/port/logger.service';
import { ApiException } from './common/domain/types/exception';
import { LoggerService } from './common/infrastructure/logger/logger.service.adapter';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private readonly testing: boolean;

  constructor(
    private readonly orm: DataSource,
    private readonly configService: ConfigService,
    @Inject(ILoggerService) private readonly logger: LoggerService,
  ) {
    this.testing = this.configService.get('testing');
  }

  public async onModuleInit(): Promise<void> {
    try {
      if (this.testing) {
        this.logger.info({ message: 'Started generating schema' });
        await this.orm.synchronize(true);
        this.logger.info({ message: 'Finished generating schema' });
      }
    } catch (error) {
      this.logger.error(
        new ApiException(error as object, HttpStatus.BAD_REQUEST),
        'Error during database connection close',
      );
    }
  }

  public async onModuleDestroy(): Promise<void> {
    try {
      if (this.testing) {
        this.logger.info({ message: 'Started dropping schema' });
        await this.orm.synchronize(true);
        this.logger.info({ message: 'Finished dropping schema' });
      }

      this.logger.info({ message: 'Closing database connection' });
      await this.orm.destroy();
      this.logger.info({ message: 'Closed database connection' });
    } catch (error) {
      this.logger.error(
        new ApiException(error as object, HttpStatus.BAD_REQUEST),
        'Error during database connection close',
      );
    }
  }
}
