import { ThrottlerStorage } from '@nestjs/throttler';
import { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface';
import IORedis, { RedisOptions } from 'ioredis';

export class RedisThrottlerStorage implements ThrottlerStorage {
  private readonly redis: IORedis;

  constructor(
    options: RedisOptions = {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  ) {
    this.redis = new IORedis(options);
  }
  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const multi = this.redis.multi();

    // Obtener el registro actual y el estado de bloqueo
    const [recordStr, blockExpiresAt] = await Promise.all([
      this.redis.get(`throttler:${throttlerName}:${key}`),
      this.redis.get(`throttler:${throttlerName}:${key}:blocked`),
    ]);
    const isBlocked = blockExpiresAt !== null;
    const timeToBlockExpire = isBlocked
      ? Math.max(0, parseInt(blockExpiresAt) - Date.now())
      : 0;

    // Si está bloqueado y el tiempo no ha expirado
    if (isBlocked && timeToBlockExpire > 0) {
      return {
        totalHits: limit + 1,
        timeToExpire: ttl * 1000,
        isBlocked: true,
        timeToBlockExpire,
      };
    }

    // Si el bloqueo expiró, eliminarlo
    if (isBlocked && timeToBlockExpire <= 0) {
      await this.redis.del(`throttler:${throttlerName}:${key}:blocked`);
    }

    // Inicializar o actualizar el contador
    let totalHits = 1;
    if (recordStr) {
      const record = JSON.parse(recordStr);
      totalHits = record.totalHits + 1;
    }

    // Verificar si excede el límite
    if (totalHits > limit) {
      // Establecer el bloqueo
      const blockExpiration = Date.now() + blockDuration;
      await this.redis.set(
        `throttler:${throttlerName}:${key}:blocked`,
        blockExpiration,
        'PX',
        blockDuration
      );

      return {
        totalHits,
        timeToExpire: ttl * 1000,
        isBlocked: true,
        timeToBlockExpire: blockDuration,
      };
    }

    // Guardar el nuevo registro
    const record = {
      totalHits,
      timestamp: Date.now(),
    };

    await this.redis.set(
      `throttler:${throttlerName}:${key}`,
      JSON.stringify(record),
      'PX',
      ttl * 1000
    );

    return {
      totalHits,
      timeToExpire: ttl * 1000,
      isBlocked: false,
      timeToBlockExpire: 0,
    };
  }
}
