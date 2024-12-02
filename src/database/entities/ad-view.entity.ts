import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { AdsEntity } from './ads.entity';

@Entity('ad_views')
export class AdViewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AdsEntity, (ad) => ad.views, { onDelete: 'CASCADE' })
  ad: AdsEntity;

  @CreateDateColumn()
  createdAt: Date;
}
