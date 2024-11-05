import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ThrottlerModuleOptions,
  ThrottlerOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';
import { RedisOptions } from 'ioredis';
import { RedisThrottlerStorage } from './throttlerRedis.store';

@Injectable()
export class ThrottlerConfig implements ThrottlerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    const config = this.configService.get<ThrottlerOptions>('throttler');
    const redisConfig = this.configService.get<RedisOptions>('redis');
    const isTesting = this.configService.get<boolean>('testing');
    // Para storage: @nest-lab/throttler-storage-redis for Redis storage
    // O buscar la forma de implementarlo por tu cuenta
    return {
      throttlers: [config],
      storage: isTesting ? undefined : new RedisThrottlerStorage(redisConfig)
    };
  }
}