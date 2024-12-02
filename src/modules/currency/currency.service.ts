import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

import { CurrencyRateEntity } from '../../database/entities/currency-rate.entity';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(CurrencyRateEntity)
    private readonly currencyRateRepository: Repository<CurrencyRateEntity>,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    await this.updateCurrencyRates();
  }

  async updateCurrencyRates(): Promise<void> {
    const response = await lastValueFrom(
      this.httpService.get(
        'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
      ),
    );

    const rates = response.data;

    const usdRate = rates.find((rate) => rate.ccy === 'USD').buy;
    const eurRate = rates.find((rate) => rate.ccy === 'EUR').buy;
    const uahRate = 1;

    await this.currencyRateRepository.save([
      { currency: 'USD', rate: parseFloat(usdRate) },
      { currency: 'EUR', rate: parseFloat(eurRate) },
      { currency: 'UAH', rate: uahRate },
    ]);
  }

  async getCurrencyRate(currency: string): Promise<number> {
    const rate = await this.currencyRateRepository.findOne({
      where: { currency },
    });
    return rate?.rate || 1;
  }
}
