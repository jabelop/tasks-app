import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { MODULES_KEY } from '../../decorators/modules-guard.decorator';
import { RoleDTO } from 'src/libs/shared/application/roles/dto/role';

@Injectable()
export class ModulesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredModules = this.reflector.getAllAndOverride<RoleDTO[]>(
      MODULES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const { user } = context.switchToHttp().getRequest();

    if (user && !user.status) {
      throw new UnauthorizedException('Your user is disabled');
    }

    if (user && !user?.role.status) {
      throw new UnauthorizedException('Your role is disabled');
    }

    if (!requiredModules) {
      return true;
    }

    const hasAccess = requiredModules.some((module) =>
      user.role.permissions?.includes(module),
    );

    if (!hasAccess) {
      throw new ForbiddenException();
    }

    return true;
  }
}
