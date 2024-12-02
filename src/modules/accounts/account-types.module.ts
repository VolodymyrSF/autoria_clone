import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountTypeEntity } from '../../database/entities/account-type.entity';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { AccountTypesController } from './account-types.controller';
import { AccountTypesService } from './account-types.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountTypeEntity]),
    AuthModule,
    RolesModule,
  ],
  controllers: [AccountTypesController],
  providers: [AccountTypesService],
  exports: [AccountTypesService],
})
export class AccountTypesModule {}
