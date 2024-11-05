import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ILoggerService } from '../../common/infrastructure/logger/logger.adapter';
import { IncomingMessage, ServerResponse } from 'node:http';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
    constructor(private readonly logger: ILoggerService) {}
    intercept(executionContext: ExecutionContext, next: CallHandler): Observable<unknown> {
      const context = `${executionContext.getClass().name}/${executionContext.getHandler().name}`;
  
      const request = executionContext.switchToHttp().getRequest();
      const response = executionContext.switchToHttp().getResponse();
  
      request['customContext'] = context;
  
      if (!request.headers?.traceid) {
        request.headers.traceid = crypto.randomUUID();
        request.id = request.headers.traceid;
      }
  
      //this.logger.pino(request, response);
      
      this.logger.pino(request?.raw, response?.raw);
      return next.handle();
    }
  }