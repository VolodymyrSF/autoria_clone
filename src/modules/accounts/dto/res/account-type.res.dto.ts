// src/modules/account-types/dto/res/account-type.res.dto.ts
import { IsEnum, IsString } from 'class-validator';

import { AccountTypeEnum } from '../../../../database/entities/enums/account-type.enum';

export class AccountTypeResDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEnum(AccountTypeEnum)
  accountType: AccountTypeEnum;
}
