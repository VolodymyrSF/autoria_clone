import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AdViewEntity } from '../../../database/entities/ad-view.entity';

@Injectable()
export class AdsViewRepository extends Repository<AdViewEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AdViewEntity, dataSource.manager);
  }
}
