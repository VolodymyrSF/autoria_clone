import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Permissions } from './decorators/permissions.decorator';
import { CreatePermissionDto } from './dto/req/create-permission.req.dto';
import { PermissionResDto } from './dto/res/permissions-res.dto';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { PermissionsService } from './permissions.service';

@ApiTags('Permissions')
@Controller('permissions')
@ApiBearerAuth()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('create_permission')
  @Post()
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({
    status: 201,
    description: 'Permission created successfully',
    type: PermissionResDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  public async createPermission(
    @Body() dto: CreatePermissionDto,
  ): Promise<PermissionResDto> {
    return await this.permissionsService.createPermission(dto);
  }

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('see_all_permissions')
  @Get()
  @ApiOperation({ summary: 'Get a list of all permissions' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all permissions',
    type: [PermissionResDto],
  })
  public async getAllPermissions(): Promise<PermissionResDto[]> {
    return await this.permissionsService.getAllPermissions();
  }

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('see_all_permissions')
  @Get(':name')
  @ApiOperation({ summary: 'Get a permission by its name' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the permission',
    type: PermissionResDto,
  })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  public async getPermissionByName(
    @Param('name') name: string,
  ): Promise<PermissionResDto> {
    return await this.permissionsService.getPermissionByName(name);
  }

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('delete_permission')
  @Delete(':name')
  @ApiOperation({ summary: 'Delete a permission by name' })
  @ApiResponse({
    status: 200,
    description: 'Permission deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  public async deletePermission(@Param('name') name: string): Promise<void> {
    return await this.permissionsService.deletePermission(name);
  }
}
