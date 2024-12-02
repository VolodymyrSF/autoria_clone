import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarBrandEntity } from '../../../database/entities/car-brand.entity';

@Injectable()
export class CarBrandsRepository extends Repository<CarBrandEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarBrandEntity, dataSource.manager);
  }
}
