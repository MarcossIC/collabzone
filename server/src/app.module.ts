import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';

import { configuration } from '@configuration/configuration';
import { configurationValidate } from '@configuration/configuration.validate';
import { datasourceOptions } from '@configuration/orm.configuration';

import { CommonModule } from '@/common/common.module';

import { GraphQLModule } from '@nestjs/graphql';
import { CacheConfig } from './configuration/cache.configuration';
import { ThrottlerConfig } from './configuration/throttler.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { MercuriusDriver } from '@nestjs/mercurius';
import { GqlConfigService } from './configuration/graphql.configuration';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { DataSource } from 'typeorm';
import { LoadersModule } from './modules/loaders/loader.module';
import { AppResolver } from './app.resolver';

//@apollo/server @as-integrations/fastify @fastify/cookie @fastify/cors @fastify/csrf-protection @mercuriusjs/gateway @nestjs/apollo  @nestjs/graphql @nestjs/mercurius @nestjs/platform-fastify graphql-query-complexity fastify graphql-scalars graphql-subscriptions graphql-upload-minimal mercurius mercurius-cache mercurius-upload mqemitter-redis
//. . . . . . . 
//Install: @apollo/server @as-integrations/fastify @fastify/cookie @fastify/cors @fastify/csrf-protection @mercuriusjs/gateway @nestjs/apollo  @nestjs/graphql @nestjs/mercurius @nestjs/platform-fastify fastify graphql-subscriptions graphql-upload-minimal mercurius mercurius-cache mercurius-upload mqemitter-redis
/* 
 "dependencies": {
    "@apollo/server": "^4.11.2",
    "@as-integrations/fastify": "^1.3.0",
    "@fastify/cookie": "^9.2.0",
    "@fastify/cors": "^8.4.1",
    "@fastify/csrf-protection": "^6.4.1",
    "@keyv/redis": "3.0.1",
    "@mercuriusjs/gateway": "^1.0.0",
    "@nestjs/apollo": "^11.0.0",
    "@nestjs/cache-manager": "2.3.0",
    "@nestjs/common": "9.3.8",
    "@nestjs/config": "3.3.0",
    "@nestjs/core": "9.3.8",
    "@nestjs/graphql": "^10.1.7",
    "@nestjs/mapped-types": "2.0.5",
    "@nestjs/mercurius": "^10.2.0",
    "@nestjs/passport": "10.0.3",
    "@nestjs/platform-fastify": "^9.3.8",
    "@nestjs/throttler": "6.2.1",
    "@nestjs/typeorm": "10.0.2",
    "bcrypt": "5.1.1",
    "better-sqlite3": "8.7.0",
    "cache-manager": "5.7.6",
    "class-transformer": "0.5.1",
    "class-validator": "0.13.0",
    "fastify": "^4.4.0",
    "graphql": "16.9.0",
    "graphql-subscriptions": "^2.0.0",
    "graphql-upload-minimal": "^1.6.1",
    "ioredis": "5.4.1",
    "joi": "17.13.3",
    "jwks-rsa": "3.1.0",
    "keyv": "5.1.3",
    "mercurius": "^10.0.0",
    "mercurius-cache": "^7.0.2",
    "mercurius-upload": "^7.0.0",
    "mqemitter-redis": "^6.0.0",
    "mysql2": "2.3.3",
    "passport": "0.7.0",
    "passport-jwt": "4.0.1",
    "pino": "9.5.0",
    "pino-http": "10.3.0",
    "pino-pretty": "11.3.0",
    "reflect-metadata": "0.1.13",
    "rxjs": "7.8.1",
    "sqlite3": "5.1.4",
    "typeorm": "0.3.11",
    "typeorm-naming-strategies": "4.1.0"
  }
*/
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: configurationValidate,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...datasourceOptions,
        autoLoadEntities: true,
      }),
      dataSourceFactory: async (options) => {
        return new DataSource(options).initialize();
      },
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule, LoadersModule],
      driver: MercuriusDriver,
      useClass: GqlConfigService,
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: CacheConfig,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlerConfig,
    }),
    CommonModule,
    LoadersModule,
  ],
  providers: [
    AppService,AppResolver
  ],
  controllers: [AppController],
})
export class AppModule {}
