import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserDTO } from '../../../libs/shared/application/users/dto/user.dto';
import { UsersService } from '../../../users/application/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.jwtSecretKey'),
    });
  }

  async validate(payload: any): Promise<UserDTO> {
    const { sub } = payload;

    return this.usersService.findOneById(sub);
  }
}
