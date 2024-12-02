import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { RoleEnum } from '../../database/entities/enums/role.enum';
import { PermissionEntity } from '../../database/entities/permissions.entity';
import { RoleEntity } from '../../database/entities/role.entity';
import { CreateRoleReqDto } from './dto/req/create-role.req.dto';
import { UpdateRoleReqDto } from './dto/req/update-role.req.dto';
import { RoleResDto } from './dto/res/role.res.dto';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async createRole(createRoleDto: CreateRoleReqDto): Promise<RoleResDto> {
    const permissions = await this.permissionRepository.find({
      where: { name: In(createRoleDto.permissions) },
    });

    const newRole = this.roleRepository.create({
      ...createRoleDto,
      permissions,
    });

    await this.roleRepository.save(newRole);

    this.logger.log('Created Role with permissions:', newRole);

    return {
      id: newRole.id,
      name: newRole.name,
      permissions: newRole.permissions.map((permission) => permission.name),
    };
  }

  async updateRoleByName(
    roleName: RoleEnum,
    updateRoleDto: UpdateRoleReqDto,
  ): Promise<RoleResDto> {
    const role = await this.roleRepository.findOne({
      where: { name: roleName },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with name "${roleName}" not found`);
    }

    if (updateRoleDto.name) {
      role.name = updateRoleDto.name;
    }

    if (updateRoleDto.permissions) {
      const permissions = await this.permissionRepository.find({
        where: { name: In(updateRoleDto.permissions) },
      });

      if (permissions.length !== updateRoleDto.permissions.length) {
        const notFoundPermissions = updateRoleDto.permissions.filter(
          (perm) => !permissions.some((p) => p.name === perm),
        );
        throw new NotFoundException(
          `Permissions not found: ${notFoundPermissions.join(', ')}`,
        );
      }

      role.permissions = permissions;
    }

    await this.roleRepository.save(role);

    return {
      id: role.id,
      name: role.name,
      permissions: role.permissions.map((permission) => permission.name),
    };
  }

  async getRoleByName(roleName: string): Promise<RoleResDto> {
    const roleEnumValue = roleName as RoleEnum;
    const role = await this.roleRepository.findOne({
      where: { name: roleEnumValue },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with name "${roleName}" not found`);
    }

    return {
      id: role.id,
      name: role.name,
      permissions: role.permissions.map((permission) => permission.name),
    };
  }

  async getRoleById(roleId: string): Promise<RoleResDto> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID "${roleId}" not found`);
    }

    return {
      id: role.id,
      name: role.name,
      permissions: role.permissions.map((permission) => permission.name),
    };
  }

  async getAllRoles(): Promise<RoleResDto[]> {
    const roles = await this.roleRepository.find({
      relations: ['permissions'],
    });

    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      permissions: role.permissions.map((permission) => permission.name),
    }));
  }

  async deleteRole(roleName: string): Promise<void> {
    const roleEnumValue = roleName as RoleEnum;

    if (!Object.values(RoleEnum).includes(roleEnumValue)) {
      throw new NotFoundException(`Role with name "${roleName}" not found`);
    }

    const role = await this.roleRepository.findOne({
      where: { name: roleEnumValue },
    });

    if (!role) {
      throw new NotFoundException(`Role with name "${roleName}" not found`);
    }

    await this.roleRepository.remove(role);
  }
}
