import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

import { errorStatus } from '../../common/domain/static/httpStatus';
import { ApiException, ErrorModel } from '../../common/domain/types/exception';
import { formatDate } from '../../common/domain/mapper/formatDay';
import { ILoggerService } from '../../common/infrastructure/logger/logger.adapter';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: ILoggerService) {}

  catch(exception: ApiException, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : [exception['status'], HttpStatus.INTERNAL_SERVER_ERROR].find(Boolean);

    exception.traceid = [exception.traceid, request['id']].find(Boolean);

    this.logger.error(exception, exception.message, exception.context);

    response.status(status).json({
      error: {
        code: status,
        traceid: exception.traceid,
        message: [errorStatus[String(status)], exception.message].find(Boolean),
        timestamp: formatDate(new Date()),
        path: request.url,
      },
    } as ErrorModel);
  }
}