import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class TaskPermissionGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authUserId = request.user.id;
    const taskUserId = request.body?.userId || request.params.id;
    if (authUserId !== taskUserId) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
