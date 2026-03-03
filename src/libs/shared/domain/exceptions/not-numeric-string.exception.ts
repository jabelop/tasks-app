import { HttpException, HttpStatus } from '@nestjs/common';

export default class NotNumericString extends HttpException {
  constructor() {
    super('The string is not a number', HttpStatus.BAD_REQUEST);
  }
}
