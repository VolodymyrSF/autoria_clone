import {
  BadRequestException,
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

import { RoleEnum } from '../../database/entities/enums/role.enum';
import { Permissions } from '../permissions/decorators/permissions.decorator';
import { JwtAccessGuard } from '../permissions/guards/jwt-access.guard';
import { PermissionsGuard } from '../permissions/guards/permissions.guard';
import { CreateRoleReqDto } from './dto/req/create-role.req.dto';
import { UpdateRoleReqDto } from './dto/req/update-role.req.dto';
import { RoleResDto } from './dto/res/role.res.dto';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('roles')
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('create_role')
  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: RoleResDto,
  })
  async createRole(
    @Body() createRoleDto: CreateRoleReqDto,
  ): Promise<RoleResDto> {
    return await this.rolesService.createRole(createRoleDto);
  }

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('edit_role')
  @Put(':name')
  @ApiOperation({ summary: 'Update an existing role by name' })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: RoleResDto,
  })
  async updateRoleByName(
    @Param('name') roleName: string,
    @Body() updateRoleDto: UpdateRoleReqDto,
  ): Promise<RoleResDto> {
    const roleEnumName = roleName as RoleEnum;

    if (!Object.values(RoleEnum).includes(roleEnumName)) {
      throw new BadRequestException('Invalid role name: ${roleName}');
    }

    return await this.rolesService.updateRoleByName(
      roleEnumName,
      updateRoleDto,
    );
  }
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('see_all_roles')
  @Get(':name')
  @ApiOperation({ summary: 'Get role by name' })
  @ApiResponse({
    status: 200,
    description: 'Role retrieved successfully',
    type: RoleResDto,
  })
  async getRoleByName(@Param('name') roleName: string): Promise<RoleResDto> {
    return await this.rolesService.getRoleByName(roleName);
  }

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('see_all_roles')
  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'Roles retrieved successfully',
    type: [RoleResDto],
  })
  async getAllRoles(): Promise<RoleResDto[]> {
    return await this.rolesService.getAllRoles();
  }
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('delete_role')
  @Delete(':name')
  @UseGuards(PermissionsGuard)
  @Permissions('delete_role')
  @ApiOperation({ summary: 'Delete role by name' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  async deleteRole(@Param('name') name: string): Promise<void> {
    return await this.rolesService.deleteRole(name);
  }
}
