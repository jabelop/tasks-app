import { HttpException, HttpStatus } from '@nestjs/common';

export default class InvalidTaskTitle extends HttpException {
  constructor() {
    super('The title must be greater than 5 and lower than 101 chars', HttpStatus.BAD_REQUEST);
  }
}
