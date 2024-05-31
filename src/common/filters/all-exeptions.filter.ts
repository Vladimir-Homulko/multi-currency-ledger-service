import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      success: false,
      message: this.getErrorMessage(exception),
      errors: this.getValidationErrors(exception),
    };

    response.status(status).json(errorResponse);
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return (response as any).message || exception.message;
    }
    return 'Internal server error';
  }

  private getValidationErrors(exception: unknown): any {
    if (exception instanceof BadRequestException) {
      const response = exception.getResponse();
      if (response && typeof response === 'object' && 'message' in response) {
        const messages = response['message'];
        if (Array.isArray(messages)) {
          return messages.map((message) => {
            if (typeof message === 'string') {
              return { message };
            }
            if (typeof message === 'object') {
              return message;
            }
            return { message: String(message) };
          });
        }
      }
    }
    return null;
  }
}
