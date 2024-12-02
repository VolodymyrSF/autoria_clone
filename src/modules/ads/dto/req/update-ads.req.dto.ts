import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateAdsReqDto {
  @ApiProperty({ example: '335aa199-63d7-4199-9bbf-f29ad21f16a8' })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The make of the car',
    example: 'Tesla',
  })
  @IsString()
  make?: string;

  @ApiProperty({
    description: 'The model of the car',
    example: 'Model S',
  })
  @IsString()
  model?: string;

  @ApiProperty({
    description: 'The price of the car',
    example: 50000,
  })
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  image?: string;

  @ApiProperty({
    description: 'The year the car was manufactured',
    example: 2022,
  })
  @IsNumber()
  year?: number;

  @ApiProperty({
    description: 'The region where the car is located',
    example: 'Kyiv',
  })
  @IsString()
  region?: string;

  @ApiProperty({
    description: 'The currency of the price',
    enum: ['USD', 'EUR', 'UAH'],
    example: 'USD',
  })
  @IsEnum(['USD', 'EUR', 'UAH'])
  currency?: string;

  @ApiProperty({
    description: 'A description of the car',
    example: 'Tesla Model S, in new condition, 10,000 km mileage',
  })
  @IsString()
  description?: string;

  @IsOptional()
  userId: string;
}
