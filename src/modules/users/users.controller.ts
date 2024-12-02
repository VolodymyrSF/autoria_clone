import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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
import { CreateUserReqDto } from './models/dto/req/create_user.req.dto';
import { UpdateUserReqDto } from './models/dto/req/update-user.req.dto';
import { UsersService } from './services/users.service';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('create_user')
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  public async create(@Body() createUserDto: CreateUserReqDto) {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('see_all_users')
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved users' })
  @ApiResponse({ status: 404, description: 'Users not found' })
  public async findAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('see_all_users')
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  public async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.findOne(id);
  }
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('edit_user')
  @ApiOperation({ summary: 'Update user details by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserReqDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, PermissionsGuard)
  @Permissions('delete_user')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  public async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
