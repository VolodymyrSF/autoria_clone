import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class CreateAdsReqDto {
  @ApiProperty({
    description: 'The make of the car',
    example: 'Tesla',
  })
  @IsString()
  make: string;

  @ApiProperty({
    description: 'The model of the car',
    example: 'Model S',
  })
  @IsString()
  model: string;

  @ApiProperty({
    description: 'The price of the car',
    example: 50000,
  })
  @Transform(TransformHelper.toNumber)
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The year the car was manufactured',
    example: 2022,
  })
  @Transform(TransformHelper.toNumber)
  @IsNumber()
  year: number;

  @ApiProperty({
    description: 'The region where the car is located',
    example: 'Kyiv',
  })
  @IsString()
  region: string;

  @ApiProperty({
    description: 'The currency of the price',
    enum: ['USD', 'EUR', 'UAH'],
    example: 'USD',
  })
  @IsEnum(['USD', 'EUR', 'UAH'])
  currency: string;

  @ApiProperty({
    description: 'A description of the car',
    example: 'Tesla Model S, in new condition, 10,000 km mileage',
  })
  @IsString()
  description: string;
  @ApiProperty({
    description: 'Photos of the car',
    type: [String],
    required: false,
  })
  @ApiProperty({
    description: 'Photos of the car',
    type: 'string',
    format: 'binary',
    isArray: true,
    required: false,
  })
  @IsOptional()
  image?: any[];

  @IsOptional()
  userId: string;
}
