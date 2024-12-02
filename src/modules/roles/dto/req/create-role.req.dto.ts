import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEnum, IsString } from 'class-validator';

import { RoleEnum } from '../../../../database/entities/enums/role.enum';

export class CreateRoleReqDto {
  @ApiProperty({
    description: 'Name of the role',
    enum: RoleEnum,
    example: RoleEnum.ADMIN,
  })
  @IsEnum(RoleEnum)
  name: RoleEnum;

  @ApiProperty({
    description: 'Array of permissions',
    type: [String],
    example: ['create_user', 'delete_user', 'update_role'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissions: string[];
}
