import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AdsEntity } from '../../../database/entities/ads.entity';

@Injectable()
export class AdsRepository extends Repository<AdsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AdsEntity, dataSource.manager);
  }
}
