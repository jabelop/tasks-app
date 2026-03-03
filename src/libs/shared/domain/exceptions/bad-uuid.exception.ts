import { HttpException, HttpStatus } from '@nestjs/common';

export default class BadUuid extends HttpException {
  constructor() {
    super('Invalid uuid', HttpStatus.BAD_REQUEST);
  }
}
