import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarModelEntity } from '../../database/entities/car-model.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { CarModelsController } from './car-models.controller';
import { CarModelsService } from './car-models.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarModelEntity, UserEntity]),
    AuthModule,
    RolesModule,
  ],
  providers: [CarModelsService],
  controllers: [CarModelsController],
  exports: [CarModelsService],
})
export class CarModelsModule {}
