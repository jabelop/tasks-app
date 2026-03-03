import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserTypeOrm } from '../../users/entity/user-typeorm.entity';
import { RoleDTO } from 'src/libs/shared/application/roles/dto/role';

@Entity('roles')
export class RoleTypeOrm extends RoleDTO {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ type: 'json' })
  permissions: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'boolean', default: true })
  status?: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserTypeOrm, (user) => user.role)
  @JoinTable()
  users: string;
}
