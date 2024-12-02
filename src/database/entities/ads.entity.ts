import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AdViewEntity } from './ad-view.entity';
import { CarBrandEntity } from './car-brand.entity';
import { CarModelEntity } from './car-model.entity';
import { UserEntity } from './user.entity';

@Entity('ads')
export class AdsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.ads, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CarBrandEntity, { nullable: false })
  @JoinColumn({ name: 'brand_id' })
  brand: CarBrandEntity;

  @ManyToOne(() => CarModelEntity, { nullable: false })
  @JoinColumn({ name: 'model_id' })
  model: CarModelEntity;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 0 })
  year: number;

  @Column()
  region: string;

  @Column()
  currency: string;

  @Column({ type: 'text' })
  description: string;

  @Column('simple-array', { nullable: true })
  image: string[];

  @Column({ default: 'pending' })
  status: string; // 'active', 'pending', 'inactive'

  @OneToMany(() => AdViewEntity, (view) => view.ad)
  views: AdViewEntity[];

  @Column({ default: 0 })
  revisionCount: number; // Лічильник спроб редагування

  @Column({ default: false })
  isApproved: boolean; // Оцінка на наявність нецензурної лексики

  @Column({ default: false })
  isCensored: boolean; // Чи містить нецензурні слова

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
