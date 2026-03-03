import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';


import { PERMISSIONS_KEY } from '../../decorators/permissions-guard.decorator';
import { RoleDTO } from 'src/libs/shared/application/roles/dto/role';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<RoleDTO[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const { user } = context.switchToHttp().getRequest();

    if (user && !user.status) {
      throw new UnauthorizedException('Your user is disabled');
    }

    if (user && !user?.role.status) {
      throw new UnauthorizedException('Your role is disabled');
    }

    if (!requiredPermissions) {
      return true;
    }

    const hasAccess = requiredPermissions.some((module) =>
      user.role.permissions?.includes(module),
    );

    if (!hasAccess) {
      throw new ForbiddenException();
    }

    return true;
  }
}
