import { HttpException, HttpStatus } from '@nestjs/common';

export default class InvalidDate extends HttpException {
  constructor(field) {
    super(`The ${field} date must be valid`, HttpStatus.BAD_REQUEST);
  }
}
