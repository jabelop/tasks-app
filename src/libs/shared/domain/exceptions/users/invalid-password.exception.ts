import { HttpException, HttpStatus } from '@nestjs/common';

export default class InvalidPassword extends HttpException {
  constructor() {
    super(
      `The password must be greater than 7 and lower than 257`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
