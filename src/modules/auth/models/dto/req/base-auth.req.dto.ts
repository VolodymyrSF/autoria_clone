import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { BaseUserReqDto } from '../../../../users/models/dto/req/base-user.req.dto';

export class BaseAuthReqDto extends PickType(BaseUserReqDto, [
  'email',
  'password',
  'name',
]) {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  @IsString()
  readonly roleName: string;

  @ApiProperty({ example: 'Basic' })
  @IsNotEmpty()
  @IsString()
  readonly accountTypeName: string;

  @ApiProperty({
    example: '5084bf98-d7db-49f8-b360-56b1e986d625',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly deviceId?: string;
}
