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
import { EventEmitterModule } from '@nestjs/event-emitter';
import { IdentityModule } from './modules/identity/identity.module';

//@apollo/server @as-integrations/fastify @fastify/cookie @fastify/cors @fastify/csrf-protection @mercuriusjs/gateway @nestjs/apollo  @nestjs/graphql @nestjs/mercurius @nestjs/platform-fastify graphql-query-complexity fastify graphql-scalars graphql-subscriptions graphql-upload-minimal mercurius mercurius-cache mercurius-upload mqemitter-redis
//. . . . . . .
//Install: @apollo/server @as-integrations/fastify @fastify/cookie @fastify/cors @fastify/csrf-protection @mercuriusjs/gateway @nestjs/apollo  @nestjs/graphql @nestjs/mercurius @nestjs/platform-fastify fastify graphql-subscriptions graphql-upload-minimal mercurius mercurius-cache mercurius-upload mqemitter-redis

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
    EventEmitterModule.forRoot({
      global: true,
      delimiter: '.',
      wildcard: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
    }),
    CommonModule,
    LoadersModule,
    IdentityModule,
  ],
  providers: [AppService, AppResolver],
  controllers: [AppController],
})
export class AppModule {}
