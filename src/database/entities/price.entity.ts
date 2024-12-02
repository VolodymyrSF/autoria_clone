import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AdsEntity } from './ads.entity';

@Entity('prices')
export class PriceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AdsEntity, (ads) => ads.price)
  ads: AdsEntity;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  currency: string;

  @Column('decimal', { precision: 10, scale: 2 })
  rate: number; // Курс валюти

  @Column('decimal', { precision: 10, scale: 2 })
  priceInUAH: number; // Ціна в UAH

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  priceInUSD?: number; // Ціна в USD

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  priceInEUR?: number; // Ціна в EUR
}
