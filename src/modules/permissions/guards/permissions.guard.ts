import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { RolesService } from '../../roles/roles.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions) {
      throw new UnauthorizedException('You do not have required permissions');
    }

    const request = context.switchToHttp().getRequest();
    const user = request.res.locals.user;

    if (!user) {
      throw new UnauthorizedException('User is not authenticated');
    }

    const role = await this.rolesService.getRoleById(user.roleId);

    if (!role) {
      throw new UnauthorizedException('Role does not exist');
    }

    if (!role.permissions) {
      throw new UnauthorizedException('Role does not have permissions');
    }

    const userPermissions = role.permissions;
    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new UnauthorizedException(
        'You do not have the required permissions',
      );
    }

    return true;
  }
}
