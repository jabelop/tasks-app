import { HttpException, HttpStatus } from '@nestjs/common';

export default class InvalidUserName extends HttpException {
  constructor() {
    super(
      `The username must be greater than 3 and lower than 51`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
