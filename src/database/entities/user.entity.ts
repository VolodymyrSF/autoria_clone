import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AccountTypeEntity } from './account-type.entity';
import { AdsEntity } from './ads.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { RoleEntity } from './role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column('text')
  name: string;

  @Column()
  password: string;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => AccountTypeEntity, (accountType) => accountType.users)
  @JoinColumn({ name: 'account_type_id' })
  accountType: AccountTypeEntity;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => AdsEntity, (ad) => ad.user)
  ads: AdsEntity[];

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];

  @Column({ type: 'uuid', nullable: true })
  deviceId: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
