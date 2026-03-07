import { HttpException, HttpStatus } from '@nestjs/common';

export class SharedTaskNotFoundException extends HttpException {
  constructor() {
    super('Shared Task not found.', HttpStatus.NOT_FOUND);
  }
}
