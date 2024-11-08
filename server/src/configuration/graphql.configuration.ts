import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { MercuriusDriverConfig, MercuriusPlugin } from '@nestjs/mercurius';
import Redis, { RedisOptions } from 'ioredis';
import mercuriusCache, { MercuriusCacheOptions } from 'mercurius-cache';
import mqRedis from 'mqemitter-redis';
import { IWsCtx } from './interfaces/wsCtx';
import { IWsParams } from './interfaces/wsParams';
import { IGqlCtx } from './interfaces/gqlCtx';
import { isNull, isUndefined } from './utils/validations';

@Injectable()
export class GqlConfigService
  implements GqlOptionsFactory<MercuriusDriverConfig>
{
  private readonly testing: boolean;
  private readonly redisOpt;

  constructor(private readonly configService: ConfigService) {
    this.testing = this.configService.get<boolean>('testing');
    this.redisOpt = this.configService.get<RedisOptions>('redis');
  }

  public createGqlOptions(): MercuriusDriverConfig {
    const plugins: MercuriusPlugin<MercuriusCacheOptions>[] = [
      {
        plugin: mercuriusCache,
        options: {
          ttl: 60,
          all: true,
          storage: this.testing
            ? {
                type: 'memory',
                options: {
                  size: 1024,
                },
              }
            : {
                type: 'redis',
                options: {
                  client: new Redis(this.redisOpt),
                  size: 2048,
                },
              },
        } as MercuriusCacheOptions,
      },
    ];
    return {
      path: '/api/graphql',
      autoSchemaFile: './schema.gql',
      graphiql: false,
      ide: false,
      routes: true,
      //autoSchemaFile: './schema.gql',
      plugins,

      /*subscription: {
        fullWsTransport: true,
        emitter: this.testing
          ? undefined
          : mqRedis({
              port: this.redisOpt.port,
              host: this.redisOpt.host,
              password: this.redisOpt.password,
            }),
        onConnect: async (info): Promise<{ ws: IWsCtx } | false> => {
          const payload = info.payload;
          //if (!authorization) return false;
          //const authArr = authorization.split(' ');
          //if (authArr.length !== 2 && authArr[0] !== 'Bearer') return false;
          console.log({payload})
          try {
            //const [userId, sessionId] = await this.authService.generateWsSession(authArr[1]);
            return { ws: { userId:1, sessionId: crypto.randomUUID() } };
          } catch (_) {
            return false;
          }
        },
        onDisconnect: async (ctx): Promise<void> => {
          const { ws } = ctx as IGqlCtx;

          if (!ws) return;

          //await this.authService.closeUserSession(ws);
        },
      },
      hooks: {
        preSubscriptionExecution: async (
          _,
          __,
          ctx: IGqlCtx,
        ): Promise<void> => {
          //const { ws } = ctx;

          //if (isUndefined(ws) || isNull(ws)) {
          //  throw new UnauthorizedException('Unauthorized');
          //}

          //await this.authService.refreshUserSession(ws);

        },
      },*/
    };
  }
}
