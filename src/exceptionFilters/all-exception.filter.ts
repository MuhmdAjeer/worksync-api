import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(Error)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let message = '';
    let stack: string | undefined = '';

    if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
    }

    response.status(500).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      stack,
    });
  }
}
