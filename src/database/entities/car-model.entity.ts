import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CarBrandEntity } from './car-brand.entity';

@Entity('car_models')
export class CarModelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => CarBrandEntity, (brand) => brand.models, { nullable: false })
  brand: CarBrandEntity;
}
