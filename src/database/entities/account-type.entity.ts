import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { AccountTypeEnum } from './enums/account-type.enum';
import { UserEntity } from './user.entity';

@Entity('account_types')
export class AccountTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AccountTypeEnum })
  name: AccountTypeEnum;

  @OneToMany(() => UserEntity, (user) => user.accountType)
  users: UserEntity[];
}
