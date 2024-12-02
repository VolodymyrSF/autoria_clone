import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CarModelEntity } from './car-model.entity';

@Entity('car_brands')
export class CarBrandEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => CarModelEntity, (model) => model.brand)
  models: CarModelEntity[];
}
