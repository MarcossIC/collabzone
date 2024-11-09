import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { ILoggerService } from '@/common/domain/port/logger.service';

import { errorStatus } from '../../common/domain/static/httpStatus';
import { ApiException, ErrorModel } from '../../common/domain/types/exception';
import { formatDate } from '../../common/domain/utils/formatDay';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: ILoggerService) {}

  catch(exception: ApiException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<FastifyReply>();
    const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : [exception['status'], HttpStatus.INTERNAL_SERVER_ERROR].find(Boolean);

    exception.traceid = [exception.traceid, request['id']].find(Boolean);

    const error = {
      code: status,
      traceid: exception.traceid,
      message: exception?.message
        ? exception.message
        : errorStatus[String(status)],
      details: undefined,
      timestamp: formatDate(new Date()),
      path: request.url,
    };

    if (error.code === HttpStatus.PRECONDITION_FAILED) {
      const res = exception.getResponse() as object;
      error.details = 'errors' in res ? res.errors : {};
    }

    response.status(status).send({
      error,
    } as ErrorModel);
  }
}
