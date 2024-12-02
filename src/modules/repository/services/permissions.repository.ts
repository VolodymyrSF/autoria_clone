import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { PermissionEntity } from '../../../database/entities/permissions.entity';

@Injectable()
export class PermissionsRepository extends Repository<PermissionEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PermissionEntity, dataSource.manager);
  }
}
