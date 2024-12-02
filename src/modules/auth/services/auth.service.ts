import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { AccountTypeEnum } from '../../../database/entities/enums/account-type.enum';
import { RoleEnum } from '../../../database/entities/enums/role.enum';
import { AccountTypeRepository } from '../../repository/services/account-type.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { RoleRepository } from '../../repository/services/role.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UserMapper } from '../../users/services/user.mapper';
import { SignInReqDto } from '../models/dto/req/sign-in.req.dto';
import { SignUpReqDto } from '../models/dto/req/sign-up.req.dto';
import { AuthResDto } from '../models/dto/res/auth.res.dto';
import { AuthCacheService } from './auth-cache-service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly authCacheService: AuthCacheService,
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly roleRepository: RoleRepository,
    private readonly accountTypeRepository: AccountTypeRepository,
  ) {}
  public async signUp(dto: SignUpReqDto): Promise<AuthResDto> {
    await this.isEmailNotExistOrThrow(dto.email);

    const password = await bcrypt.hash(dto.password, 10);

    const role = await this.roleRepository.findOne({
      where: { name: dto.roleName as RoleEnum },
    });
    if (!role) {
      throw new Error(`Role with name ${dto.roleName} not found`);
    }

    const accountType = await this.accountTypeRepository.findOne({
      where: { name: dto.accountTypeName as AccountTypeEnum },
    });
    if (!accountType) {
      throw new Error(
        `Account type with name ${dto.accountTypeName} not found`,
      );
    }

    const deviceId = dto.deviceId ? dto.deviceId : uuidv4();

    const user = this.userRepository.create({
      email: dto.email,
      password,
      name: dto.name,
      role,
      accountType,
      deviceId,
    });
    const savedUser = await this.userRepository.save(user);

    const tokens = await this.tokenService.generateAuthTokens({
      userId: savedUser.id,
      deviceId,
      roleId: role.id,
      accountId: accountType.id,
    });

    await Promise.all([
      this.authCacheService.saveToken(
        tokens.accessToken,
        savedUser.id,
        deviceId,
      ),
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: savedUser.id,
          deviceId,
          refreshToken: tokens.refreshToken,
        }),
      ),
    ]);

    return { user: UserMapper.toResDto(savedUser), tokens };
  }

  public async signIn(dto: SignInReqDto): Promise<AuthResDto> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: ['role', 'accountType', 'refreshTokens'],
      select: ['id', 'password', 'deviceId', 'role', 'name'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    let deviceId = user.deviceId;
    if (!deviceId) {
      deviceId = uuidv4();
      user.deviceId = deviceId;
      await this.userRepository.save(user);
    }

    const tokens = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId,
      roleId: user.role.id,
      accountId: user.accountType.id,
    });

    await Promise.all([
      this.authCacheService.saveToken(
        tokens.accessToken,
        user.id,
        user.deviceId,
      ),
      this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          user_id: user.id,
          deviceId: user.deviceId,
          refreshToken: tokens.refreshToken,
        }),
      ),
    ]);

    return { user: UserMapper.toResDto(user), tokens };
  }

  private async isEmailNotExistOrThrow(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new Error('Email already exists');
    }
  }
}