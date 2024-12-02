import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';

import { TransformHelper } from '../../../../../common/helpers/transform.helper';

export class BaseUserReqDto {
  @IsOptional()
  @ApiProperty({ example: 'Viktor' })
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  name?: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsString()
  @Length(0, 300)
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  email: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  @IsString()
  @Length(0, 300)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  password: string;

  @ApiProperty({ example: 'c56a4180-65aa-42ec-a945-5fd21dec0538' })
  @IsUUID()
  roleId: string;

  @ApiProperty({ example: 'b2e8df44-9b60-43f5-8a18-bf4b7c559cc3' })
  @IsUUID()
  accountTypeId: string;

  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  @IsString()
  readonly roleName: string;

  @ApiProperty({ example: 'Basic' })
  @IsNotEmpty()
  @IsString()
  readonly accountTypeName: string;
}
