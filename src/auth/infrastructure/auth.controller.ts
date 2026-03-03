import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { User } from '../../libs/shared/domain/users/entity/user';
import { AuthService } from '../application/auth.service';
import { Public } from '../decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginSuccessDto } from '../application/dto/login-success.dto';
import { LoginDTO } from '../application/dto/login.dto';
import { UserDTO } from 'src/libs/shared/application/users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() params: LoginDTO): Promise<LoginSuccessDto> {
    return this.authService.login(
      params.username,
      params.password,
    );
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() user: UserDTO,
  ): Promise<UserDTO> {
   return await this.authService.signup(user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async getMe(
    @Request() req: Request & { user: User },
  ): Promise<LoginSuccessDto> {
    return await this.authService.refreshToken(req.user);
  }


}
