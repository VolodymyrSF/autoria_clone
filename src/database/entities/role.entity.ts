import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RoleEnum } from './enums/role.enum';
import { PermissionEntity } from './permissions.entity';
import { UserEntity } from './user.entity';

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: RoleEnum, unique: true }) // Використання enum
  name: RoleEnum;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
  @JoinTable() // Це забезпечить створення допоміжної таблиці для зв'язку many-to-many
  permissions: PermissionEntity[];
}
