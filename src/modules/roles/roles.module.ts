import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionEntity } from '../../database/entities/permissions.entity';
import { RoleEntity } from '../../database/entities/role.entity';
import { AuthModule } from '../auth/auth.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PermissionsRepository } from '../repository/services/permissions.repository';
import { RoleRepository } from '../repository/services/role.repository';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      PermissionEntity,
      RoleRepository,
      PermissionsRepository,
    ]),
    forwardRef(() => PermissionsModule),
    AuthModule,
  ],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
