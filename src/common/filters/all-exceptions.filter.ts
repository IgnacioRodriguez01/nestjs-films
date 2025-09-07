import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    BadRequestException,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message: any = 'Internal server error';
  
      // Errores que vienen de HttpException (BadRequest, NotFound, Unauthorized...)
      if (exception instanceof HttpException) {
        status = exception.getStatus();
        message = exception.getResponse();
  
        // Si es un objeto con 'message'
        if (typeof message === 'object' && message !== null && 'message' in message) {
          message = (message as any).message;
        }
  
        // Detectar error de validación de DTO
        if (exception instanceof BadRequestException && Array.isArray(message)) {
          message = message.flatMap((m: any) =>
            typeof m === 'string' ? m : Object.values(m).flat()
          );
        }
      }
  
      // Para errores no manejados
      else if (exception instanceof Error) {
        message = exception.message;
      }
  
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
    }
  }
  