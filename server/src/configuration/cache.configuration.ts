import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

@Injectable()
export class CacheConfig implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async createCacheOptions(): Promise<CacheModuleOptions> {
    const ttl = this.configService.get<number>('ttl');

    if (this.configService.get<boolean>('testing')) {
      return { ttl };
    } else {
      const redisConfig = this.configService.get('redis');
      const redisUri = `redis://${redisConfig.host}:${redisConfig.port}`;
      const keyv = new Keyv({
        store: new KeyvRedis(redisUri),
        ttl: ttl * 1000, 
      });

      return keyv;
    }
  }
}