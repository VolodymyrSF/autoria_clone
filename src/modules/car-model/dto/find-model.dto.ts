import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindModelDto {
  @ApiProperty({ example: 'BMW' })
  @IsNotEmpty()
  @IsString()
  brandName: string;
}
