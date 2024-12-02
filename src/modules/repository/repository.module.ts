import { Global, Module } from '@nestjs/common';

import { AccountTypeRepository } from './services/account-type.repository';
import { AdsRepository } from './services/ads.repository';
import { CarBrandsRepository } from './services/car-brands.repository';
import { CarModelsRepository } from './services/car-models.repository';
import { CurrencyRateRepository } from './services/currency-rate.repository';
import { PermissionsRepository } from './services/permissions.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { RoleRepository } from './services/role.repository';
import { UserRepository } from './services/user.repository';

const repositories = [
  UserRepository,
  RoleRepository,
  CarBrandsRepository,
  CarModelsRepository,
  CurrencyRateRepository,
  AccountTypeRepository,
  AdsRepository,
  RefreshTokenRepository,
  PermissionsRepository,
];

@Global()
@Module({
  providers: [...repositories],
  exports: [...repositories],
})
export class RepositoryModule {}
