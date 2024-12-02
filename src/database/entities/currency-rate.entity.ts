import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('currency_rates')
export class CurrencyRateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency: string; // USD, EUR, UAH

  @Column('decimal', { precision: 10, scale: 2 })
  rate: number; // Курс валюти
}
