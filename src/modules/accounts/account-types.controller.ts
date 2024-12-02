import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Permissions } from '../permissions/decorators/permissions.decorator';
import { JwtAccessGuard } from '../permissions/guards/jwt-access.guard';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { AccountTypesService } from './account-types.service';
import { CreateAccountTypeReqDto } from './dto/req/create-account-type.req.dto';
import { UpdateAccountTypeReqDto } from './dto/req/update-account-type.req.dto';
import { AccountTypeResDto } from './dto/res/account-type.res.dto';

@ApiTags('Account Types')
@Controller('account-types')
@ApiBearerAuth()
export class AccountTypesController {
  constructor(private readonly accountTypesService: AccountTypesService) {}

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('create_account_type')
  @Post()
  @ApiOperation({ summary: 'Create a new account type' })
  @ApiResponse({
    status: 201,
    description: 'Account type created successfully',
    type: AccountTypeResDto,
  })
  async createAccountType(
    @Body() createAccountTypeDto: CreateAccountTypeReqDto,
  ): Promise<AccountTypeResDto> {
    return await this.accountTypesService.createAccountType(
      createAccountTypeDto,
    );
  }

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('update_account_type')
  @Put(':name')
  @ApiOperation({ summary: 'Update an existing account type by name' })
  @ApiResponse({
    status: 200,
    description: 'Account type updated successfully',
    type: AccountTypeResDto,
  })
  async updateAccountType(
    @Param('name') name: string,
    @Body() updateAccountTypeDto: UpdateAccountTypeReqDto,
  ): Promise<AccountTypeResDto> {
    return await this.accountTypesService.updateAccountType(
      name,
      updateAccountTypeDto,
    );
  }

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('see_all_account_type')
  @Get(':name')
  @ApiOperation({ summary: 'Get account type by name' })
  @ApiResponse({
    status: 200,
    description: 'Account type retrieved successfully',
    type: AccountTypeResDto,
  })
  async getAccountTypeByName(
    @Param('name') name: string,
  ): Promise<AccountTypeResDto> {
    return await this.accountTypesService.getAccountTypeByName(name);
  }
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('see_all_account_type')
  @Get()
  @ApiOperation({ summary: 'Get all account types' })
  @ApiResponse({
    status: 200,
    description: 'Account types retrieved successfully',
    type: [AccountTypeResDto],
  })
  async getAllAccountTypes(): Promise<AccountTypeResDto[]> {
    return await this.accountTypesService.getAllAccountTypes();
  }
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('delete_account_type')
  @Delete(':name')
  @ApiOperation({ summary: 'Delete account type by name' })
  @ApiResponse({
    status: 200,
    description: 'Account type deleted successfully',
  })
  async deleteAccountType(@Param('name') name: string): Promise<void> {
    return await this.accountTypesService.deleteAccountType(name);
  }
}
