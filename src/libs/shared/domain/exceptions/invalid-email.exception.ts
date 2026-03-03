import { HttpException, HttpStatus } from '@nestjs/common';

export default class InvalidEmail extends HttpException {
  constructor() {
    super(`The email must be valid and no longer than 300 chars`, HttpStatus.BAD_REQUEST);
  }
}
