import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CarModelDto {
  @ApiProperty({ example: 'X5' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'BMW' })
  @IsNotEmpty()
  @IsString()
  brandName: string;
}
