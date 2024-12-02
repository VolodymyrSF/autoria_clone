import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CarModelEntity } from '../../database/entities/car-model.entity';
import { Permissions } from '../permissions/decorators/permissions.decorator';
import { JwtAccessGuard } from '../permissions/guards/jwt-access.guard';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { CarModelsService } from './car-models.service';
import { CarModelDto } from './dto/car-model.dto';

@ApiTags('Car Models')
@Controller('car-models')
@ApiBearerAuth()
export class CarModelsController {
  constructor(private readonly carModelsService: CarModelsService) {}

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('create_car_model')
  @ApiOperation({ summary: 'Create model of the car' })
  @Post('create')
  async createModel(@Body() carModelDto: CarModelDto): Promise<CarModelEntity> {
    const { name, brandName } = carModelDto;
    return await this.carModelsService.createModel(name, brandName);
  }

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('see_all_models')
  @ApiOperation({ summary: 'Get car models by brand name' })
  @Get('brandName')
  async getModelsByBrandName(
    @Query('brand') brandName: string,
  ): Promise<CarModelEntity[]> {
    return await this.carModelsService.findModelsByBrand(brandName);
  }

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('notify_missing')
  @ApiOperation({ summary: 'Notify about missing model' })
  @Post('missing')
  async reportMissingModel(@Body() carModelDto: CarModelDto) {
    return await this.carModelsService.notifyMissingModel(
      carModelDto.name,
      carModelDto.brandName,
    );
  }
}
