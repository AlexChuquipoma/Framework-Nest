import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let details: Record<string, string> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        const respBody = exceptionResponse as any;
        
        // Caso: Error de validación con class-validator (Array de errores)
        if (Array.isArray(respBody.message)) {
          message = 'Datos de entrada inválidos';
          details = this.extractValidationErrors(respBody.message);
        } else {
          message = respBody.message || exception.message;
        }
      } else {
        message = exception.message;
      }
    } else {
      // Error no controlado
      console.error(exception); // Útil para ver el error en consola del servidor
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error interno del servidor';
    }

    const errorResponse: ErrorResponse = {
      timestamp: new Date().toISOString(),
      status,
      error: HttpStatus[status] || 'Internal Server Error',
      message,
      path: request.url,
      ...(details && { details }),
    };

    response.status(status).json(errorResponse);
  }

  // Método avanzado para limpiar los mensajes de class-validator
  private extractValidationErrors(messages: any[]): Record<string, string> {
    const errors: Record<string, string> = {};
    messages.forEach((msg) => {
      // Intenta extraer propiedad y restricción si viene estructurado
      if (typeof msg === 'string') {
        const parts = msg.split(' ');
        errors[parts[0]] = msg;
      } else if (typeof msg === 'object' && msg.property && msg.constraints) {
        const firstConstraint = Object.values(msg.constraints)[0];
        errors[msg.property] = firstConstraint as string;
      }
    });
    return errors;
  }
}