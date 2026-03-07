import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../application/users.service';

@Injectable()
export class UserUsernameGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authUser = request.user;

    if (!authUser) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOneById(request.params.id);

    const usernameExists = await this.usersService.findByUsername(
      request.body.username,
    );

    if (usernameExists && usernameExists.id !== user.id) {
      throw new BadRequestException('Username already taken');
    }

    return true;
  }
}
