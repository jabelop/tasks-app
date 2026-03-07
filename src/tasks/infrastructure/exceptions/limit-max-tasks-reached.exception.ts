import { HttpException, HttpStatus } from '@nestjs/common';

export class LimitMaxTasksReachedException extends HttpException {
  constructor() {
    super(
      'Yo have reached your max number of tasks created',
      HttpStatus.NOT_FOUND,
    );
  }
}
