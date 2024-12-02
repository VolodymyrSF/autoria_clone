import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CarBrandDto {
  @ApiProperty({ example: 'BMW' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
