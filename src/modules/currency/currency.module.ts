import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurrencyRateEntity } from '../../database/entities/currency-rate.entity';
import { CurrencyService } from './currency.service';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyRateEntity]), HttpModule],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
