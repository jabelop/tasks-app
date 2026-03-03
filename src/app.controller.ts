import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { Public } from './auth/infrastructure/decorators/public.decorator';

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get('/ping')
  ping(): { status: boolean } {
    return {
      status: true,
    };
  }

  @Public()
  @Get('/')
  root(): { status: boolean } {
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
}
