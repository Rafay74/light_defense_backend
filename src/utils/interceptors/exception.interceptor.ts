import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface HttpExceptionResponse {
  message?: string | string[];
}

function getHttpExceptionMessage(exception: HttpException): string {
  const response = exception.getResponse();
  if (typeof response === 'string') return response;

  const msg = (response as HttpExceptionResponse).message;
  if (msg === undefined) return exception?.message ?? 'Internal server error';
  return Array.isArray(msg) ? msg.join(', ') : msg;
}

function getUnknownExceptionMessage(exception: unknown): string {
  return exception instanceof Error
    ? exception.message
    : 'Internal server error';
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? getHttpExceptionMessage(exception)
        : getUnknownExceptionMessage(exception);

    response.status(status).json({
      success: false,
      error: message,
    });
  }
}
