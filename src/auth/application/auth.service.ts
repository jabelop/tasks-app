import {
  Injectable,
  Inject,
} from '@nestjs/common';

import { User } from 'src/libs/shared/domain/users/entity/user';
import { UserDTO } from 'src/libs/shared/application/users/dto/user.dto';
import { LoginSuccessDto } from './dto/login-success.dto';
import { AuthRepository } from '../domain/repository/auth.repository';

@Injectable()
export class AuthService {

  constructor(
    @Inject(AuthRepository)
    private readonly authRepository: AuthRepository,
  ){}

  async login(username: string, password: string): Promise<LoginSuccessDto> {
    return this.authRepository.login(username, password);
  }

  async signup(user: UserDTO): Promise<User> {
    return this.authRepository.signup(UserDTO.validate(user));
  }

  async refreshToken(user: UserDTO): Promise<LoginSuccessDto> {
    return this.authRepository.refreshToken(user);
  }
}
