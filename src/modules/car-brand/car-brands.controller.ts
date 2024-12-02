import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CarBrandEntity } from '../../database/entities/car-brand.entity';
import { Permissions } from '../permissions/decorators/permissions.decorator';
import { JwtAccessGuard } from '../permissions/guards/jwt-access.guard';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { CarBrandsService } from './car-brands.service';
import { CarBrandDto } from './dto/car-brand.dto';

@ApiTags('Car Brands')
@Controller('car-brands')
@ApiBearerAuth()
export class CarBrandsController {
  constructor(private readonly carBrandsService: CarBrandsService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of all car brands' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved car brands',
    type: [CarBrandEntity],
  })
  public async getAllBrands(): Promise<CarBrandEntity[]> {
    return await this.carBrandsService.findAllBrands();
  }

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('create_car_brand')
  @Post('create')
  @ApiOperation({ summary: 'Create a new car brand' })
  @ApiResponse({
    status: 201,
    description: 'Car brand created successfully',
    type: CarBrandEntity,
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  public async createBrand(
    @Body() carBrandDto: CarBrandDto,
  ): Promise<CarBrandEntity> {
    const { name } = carBrandDto;
    return await this.carBrandsService.createBrand(name);
  }

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('notify_missing')
  @Post('missing')
  @ApiOperation({ summary: 'Report a missing car brand' })
  @ApiResponse({
    status: 201,
    description: 'Admins was notified successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid brand name provided' })
  public async reportMissingBrand(@Body() carBrandDto: CarBrandDto) {
    return await this.carBrandsService.notifyMissingBrand(carBrandDto.name);
  }
}
