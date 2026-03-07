import { HttpException, HttpStatus } from '@nestjs/common';

export default class InvalidTaskDescription extends HttpException {
  constructor() {
    super(
      'The description must be lower than 501 chars',
      HttpStatus.BAD_REQUEST,
    );
  }
}
