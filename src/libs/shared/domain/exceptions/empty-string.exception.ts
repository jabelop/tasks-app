import { HttpException, HttpStatus } from '@nestjs/common';

export default class EmptyString extends HttpException {
  constructor() {
    super('The string must not be empty', HttpStatus.BAD_REQUEST);
  }
}
