import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(message = 'User not found.', statusCode = HttpStatus.NOT_FOUND) {
    super(message, statusCode);
  }
}
