import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();

    // FIXME: find a elegant solution to handle this
    const defaultRes = exception.getResponse();

    let msg = {};
    if (defaultRes instanceof Object) {
      msg = {
        ...defaultRes,
      };
    }

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
      stack: exception.stack,
      ...msg,
    });
  }
}
