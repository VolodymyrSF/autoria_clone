import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'name of permissions',
    example: 'CREATE_USER',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
