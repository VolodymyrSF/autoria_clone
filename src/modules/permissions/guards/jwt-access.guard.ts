import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { SKIP_AUTH } from '../../auth/decorators/skip-auth.decorator';
import { TokenType } from '../../auth/models/enums/token-type.enum';
import { AuthCacheService } from '../../auth/services/auth-cache-service';
import { TokenService } from '../../auth/services/token.service';
import { UserRepository } from '../../repository/services/user.repository';
import { UserMapper } from '../../users/services/user.mapper';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skipAuth) return true;

    const request = context.switchToHttp().getRequest();
    const accessToken = request.get('Authorization')?.split('Bearer ')[1];

    if (!accessToken) {
      throw new UnauthorizedException('Access token is missing');
    }

    const payload = await this.tokenService.verifyToken(
      accessToken,
      TokenType.ACCESS,
    );

    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    const isAccessTokenExist = await this.authCacheService.isAccessTokenExist(
      payload.userId,
      payload.deviceId,
      accessToken,
    );

    if (!isAccessTokenExist) {
      throw new UnauthorizedException('Access token is not found in cache');
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.userId },
      relations: ['role', 'accountType'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    request.res.locals.user = {
      ...UserMapper.toIUserData(user, payload),
      role: user.role,
      accountType: user.accountType,
    };

    return true;
  }
}
