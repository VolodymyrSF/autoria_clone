import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { AccountTypeEnum } from '../../../../database/entities/enums/account-type.enum';

export class UpdateAccountTypeReqDto {
  @ApiProperty({ example: 'basic', description: 'Account type name' })
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Premium or Basic ', description: 'Account type' })
  @IsNotEmpty()
  @IsEnum(AccountTypeEnum)
  accountType: AccountTypeEnum;
}
