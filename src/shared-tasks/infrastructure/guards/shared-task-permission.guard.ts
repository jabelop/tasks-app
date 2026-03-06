import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class SharedTaskPermissionGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authUserId = request.user.id;
    const taskUserId = request.body?.userId || request.params.id;
    const taskOwnerId = request.body?.ownerId || request.params.id;
    if (authUserId !== taskUserId && authUserId !== taskOwnerId) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
