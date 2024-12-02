import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdViewEntity } from '../../database/entities/ad-view.entity';
import { AdsEntity } from '../../database/entities/ads.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { CarBrandsModule } from '../car-brand/car-brands.module';
import { CarModelsModule } from '../car-model/car-models.module';
import { CurrencyModule } from '../currency/currency.module';
import { FileStorageModule } from '../file-storage/file-storage.module';
import { JwtAccessGuard } from '../permissions/guards/jwt-access.guard';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { RolesModule } from '../roles/roles.module';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdsEntity, UserEntity, AdViewEntity]),
    CarBrandsModule,
    CarModelsModule,
    CurrencyModule,
    AuthModule,
    RolesModule,
    FileStorageModule,
  ],
  controllers: [AdsController],
  providers: [JwtAccessGuard, AdsService, PermissionsGuard],
})
export class AdsModule {}
