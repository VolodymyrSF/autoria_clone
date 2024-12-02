import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RoleEntity } from './role.entity';

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Наприклад, 'create_ad', 'delete_ad', 'update_ad', 'view_all_users', 'manage_roles'

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];
}
