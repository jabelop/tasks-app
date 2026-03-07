import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AuthService } from 'src/auth/application/auth.service';
import { LoginSuccessDto } from 'src/auth/application/dto/login-success.dto';
import { AuthRepository } from 'src/auth/domain/repository/auth.repository';
import { HashService } from 'src/libs/hash/src/hash.service';
import { UserDTO } from 'src/libs/shared/application/users/dto/user.dto';
import { UserTypeOrm } from 'src/libs/shared/infrastructure/users/entity/user-typeorm.entity';
import { TokenService } from 'src/libs/token/src/token.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthTypeOrmRepository implements AuthRepository {
  constructor(
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
    @InjectRepository(UserTypeOrm)
    private readonly usersRepository: Repository<UserTypeOrm>,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async login(username: string, password: string): Promise<LoginSuccessDto> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['role'],
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isValidPassword = await this.hashService.verify(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.checkUser(user);
    user.lastLogin = new Date();
    await this.usersRepository.save(user);

    return {
      user: user,
      token: this.tokenService.generate({
        sub: user.id,
      }),
    };
  }

  async signup(user: UserTypeOrm): Promise<UserTypeOrm> {
    return await this.usersRepository.save(user);
  }

  async refreshToken(user: UserDTO): Promise<LoginSuccessDto> {
    const refreshUser = await this.usersRepository.findOne({
      where: { id: user.id },
      relations: ['role'],
    });

    if (!refreshUser?.status) {
      throw new UnauthorizedException('Your user is disabled');
    }

    if (!refreshUser?.role.status) {
      throw new UnauthorizedException('Your role is disabled');
    }

    return {
      user: refreshUser,
      token: this.tokenService.generate({
        sub: user.id,
      }),
    };
  }

  private checkUser(user: UserDTO): void {
    if (!user.status) {
      throw new UnauthorizedException('Your user is disabled');
    }

    if (!user?.role.status) {
      throw new UnauthorizedException('Your role is disabled');
    }
  }
}
