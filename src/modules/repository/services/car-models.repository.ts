import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarModelEntity } from '../../../database/entities/car-model.entity';

@Injectable()
export class CarModelsRepository extends Repository<CarModelEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarModelEntity, dataSource.manager);
  }
}
