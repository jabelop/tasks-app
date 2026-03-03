import { HttpException, HttpStatus } from '@nestjs/common';

export default class NegativeNumeric extends HttpException {
  constructor() {
    super('The number must be greater than 0', HttpStatus.BAD_REQUEST);
  }
}
