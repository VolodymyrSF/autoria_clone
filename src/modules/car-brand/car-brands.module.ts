import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarBrandEntity } from '../../database/entities/car-brand.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { CarBrandsController } from './car-brands.controller';
import { CarBrandsService } from './car-brands.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarBrandEntity, UserEntity]),
    AuthModule,
    RolesModule,
  ],
  providers: [CarBrandsService],
  controllers: [CarBrandsController],
  exports: [CarBrandsService],
})
export class CarBrandsModule {}
