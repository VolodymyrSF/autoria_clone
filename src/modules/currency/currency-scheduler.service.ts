import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { CurrencyService } from './currency.service';

@Injectable()
export class CurrencyScheduler {
  constructor(private readonly currencyService: CurrencyService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateCurrencyRates() {
    await this.currencyService.updateCurrencyRates();
  }
}
