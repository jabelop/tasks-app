import { HttpException, HttpStatus } from '@nestjs/common';

export default class InvalidTaskStatus extends HttpException {
  constructor() {
    super('The allowed status are complete and not complete', HttpStatus.BAD_REQUEST);
  }
}
