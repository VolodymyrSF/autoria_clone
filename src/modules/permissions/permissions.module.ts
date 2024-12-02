import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionEntity } from '../../database/entities/permissions.entity';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { PermissionsGuard } from './guards/permissions.guard';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionEntity]),
    forwardRef(() => RolesModule),
    AuthModule,
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsGuard],
  exports: [PermissionsService],
})
export class PermissionsModule {}
