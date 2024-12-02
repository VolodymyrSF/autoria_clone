import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { JwtAccessGuard } from '../permissions/guards/jwt-access.guard';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { RolesModule } from '../roles/roles.module';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [AuthModule, RolesModule],
  controllers: [UsersController],
  providers: [JwtAccessGuard, UsersService, PermissionsGuard],
  exports: [UsersService],
})
export class UsersModule {}
