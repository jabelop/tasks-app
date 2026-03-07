import { HttpException, HttpStatus } from '@nestjs/common';

export default class InvalidName extends HttpException {
  constructor() {
    super(
      `The name must be greater than 3 and lower than 51`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
