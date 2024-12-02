import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AccountTypeEntity } from '../../database/entities/account-type.entity';
import { AccountTypeEnum } from '../../database/entities/enums/account-type.enum';
import { CreateAccountTypeReqDto } from './dto/req/create-account-type.req.dto';
import { UpdateAccountTypeReqDto } from './dto/req/update-account-type.req.dto';
import { AccountTypeResDto } from './dto/res/account-type.res.dto';

@Injectable()
export class AccountTypesService {
  constructor(
    @InjectRepository(AccountTypeEntity)
    private readonly accountTypeRepository: Repository<AccountTypeEntity>,
  ) {}

  async createAccountType(
    createAccountTypeDto: CreateAccountTypeReqDto,
  ): Promise<AccountTypeResDto> {
    const newAccountType = this.accountTypeRepository.create({
      name: createAccountTypeDto.accountType as AccountTypeEnum,
    });

    const savedAccountType =
      await this.accountTypeRepository.save(newAccountType);

    return {
      id: savedAccountType.id,
      name: savedAccountType.name,
      accountType: savedAccountType.name,
    };
  }

  async updateAccountType(
    name: string,
    updateAccountTypeDto: UpdateAccountTypeReqDto,
  ): Promise<AccountTypeResDto> {
    const accountType = await this.accountTypeRepository.findOne({
      where: { name: name as AccountTypeEnum }, // Приводимо до enum
    });

    if (!accountType) {
      throw new NotFoundException(`Account type with name "${name}" not found`);
    }

    Object.assign(accountType, updateAccountTypeDto);
    const updatedAccountType =
      await this.accountTypeRepository.save(accountType);

    return {
      id: updatedAccountType.id,
      name: updatedAccountType.name,
      accountType: updatedAccountType.name,
    };
  }
  async getAllAccountTypes(): Promise<AccountTypeResDto[]> {
    const accountTypes = await this.accountTypeRepository.find();

    return accountTypes.map((accountType) => ({
      id: accountType.id,
      name: accountType.name,
      accountType: accountType.name,
    }));
  }

  async getAccountTypeByName(name: string): Promise<AccountTypeResDto> {
    const accountType = await this.accountTypeRepository.findOne({
      where: { name: name as AccountTypeEnum },
      relations: ['users'],
    });

    if (!accountType) {
      throw new NotFoundException(`Account type with name "${name}" not found`);
    }

    return {
      id: accountType.id,
      name: accountType.name,
      accountType: accountType.name,
    };
  }

  async deleteAccountType(name: string): Promise<void> {
    const accountType = await this.accountTypeRepository.findOne({
      where: { name: name as AccountTypeEnum },
    });

    if (!accountType) {
      throw new NotFoundException(`Account type with name "${name}" not found`);
    }

    await this.accountTypeRepository.remove(accountType);
  }
}
