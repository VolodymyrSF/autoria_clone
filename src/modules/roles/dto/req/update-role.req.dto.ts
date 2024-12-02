import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

import { RoleEnum } from '../../../../database/entities/enums/role.enum';

export class UpdateRoleReqDto {
  @ApiProperty({
    description: 'Name of the role',
    enum: RoleEnum,
    example: RoleEnum.ADMIN,
  })
  @IsOptional()
  @IsEnum(RoleEnum)
  name?: RoleEnum;

  @ApiProperty({
    description: 'Array of permissions',
    type: [String],
    example: ['create_user', 'delete_user', 'update_role'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
