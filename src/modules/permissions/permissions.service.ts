import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PermissionEntity } from '../../database/entities/permissions.entity';
import { CreatePermissionDto } from './dto/req/create-permission.req.dto';
import { PermissionResDto } from './dto/res/permissions-res.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  async createPermission(dto: CreatePermissionDto): Promise<PermissionResDto> {
    const permission = this.permissionRepository.create(dto);
    const savedPermission = await this.permissionRepository.save(permission);
    return new PermissionResDto(savedPermission.id, savedPermission.name);
  }

  async getAllPermissions(): Promise<PermissionResDto[]> {
    const permissions = await this.permissionRepository.find();
    return permissions.map(
      (permission) => new PermissionResDto(permission.id, permission.name),
    );
  }

  async getPermissionByName(name: string): Promise<PermissionResDto> {
    const permission = await this.permissionRepository.findOne({
      where: { name },
    });
    if (!permission) {
      throw new NotFoundException(`Permission with name "${name}" not found`);
    }
    return new PermissionResDto(permission.id, permission.name);
  }

  async deletePermission(name: string): Promise<void> {
    const permission = await this.permissionRepository.findOne({
      where: { name },
    });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${name} not found`);
    }
    await this.permissionRepository.remove(permission);
  }
}
