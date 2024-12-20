import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyCsrf from '@fastify/csrf-protection';
import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  RequestMethod,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import mercuriusUpload from 'mercurius-upload';
import 'reflect-metadata';

import { AppModule } from './app.module';
import { Cluster } from './cluster';
import { CommonModule } from './common/common.module';
import { ILoggerService } from './common/domain/port/logger.service';
import { AppExceptionFilter } from './configuration/filters/exception.filter';
import { ExceptionInterceptor } from './configuration/interceptors/exception.interceptor';
import { HttpLoggerInterceptor } from './configuration/interceptors/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  const configService = app.get(ConfigService);
  app.register(fastifyCors as any, {
    credentials: true,
    origin: [
      `${configService.get<string>('server.UI_URL')}`,
      `${configService.get<string>('server.UI_LOCAL_URL')}`,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
    exposedHeaders: '*',
    maxAge: 3600,
  });
  app.register(fastifyCsrf as any, { cookieOpts: { signed: true } });
  app.register(fastifyCookie as any, {
    secret: configService.get<string>('server.COOKIE_SECRET'),
  });
  app.register(mercuriusUpload as any, configService.get('upload'));

  const logger = app.select(CommonModule).get(ILoggerService);
  logger.setApplication('collab-zone');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: HttpStatus.PRECONDITION_FAILED,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          messages: Object.values(error.constraints || {}),
        }));
        return new HttpException(
          {
            statusCode: HttpStatus.PRECONDITION_FAILED,
            message: 'Validation failed',
            errors: formattedErrors,
          },
          HttpStatus.PRECONDITION_FAILED,
        );
      },
    }),
  );
  app.enableShutdownHooks();
  app.useGlobalFilters(new AppExceptionFilter(logger));
  app.useGlobalInterceptors(
    new ExceptionInterceptor(),
    new HttpLoggerInterceptor(logger),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useLogger(logger);
  const port = configService.get('server.port');

  await app.listen(port);
  logger.log(`🟢 collab-zone listening at ${port} on HOST 🟢\n`);
}

Cluster.createCluster(bootstrap);
