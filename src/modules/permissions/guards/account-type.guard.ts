import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AccountTypeEnum } from '../../../database/entities/enums/account-type.enum';

@Injectable()
export class AccountTypeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.res.locals.user;

    if (!user || !user.accountType) {
      throw new ForbiddenException(
        'Account type is missing or user is unauthorized.',
      );
    }

    if (user.accountType.name !== AccountTypeEnum.PREMIUM) {
      throw new ForbiddenException(
        'Access denied. Premium account is required for this action.',
      );
    }

    return true;
  }
}
