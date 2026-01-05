import { HttpStatus } from '@nestjs/common';
import { ApplicationException } from '../base/application.exception';

// ¡Asegúrate de que diga EXPORT class!
export class NotFoundException extends ApplicationException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}