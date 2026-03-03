import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RoleTypeOrm } from '../../roles/entity/role-typeorm.entity';
import { UserDTO } from 'src/libs/shared/application/users/dto/user.dto';
import { RoleDTO } from 'src/libs/shared/application/roles/dto/role';

@Entity('users')
export class UserTypeOrm extends UserDTO {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'uuid' })
  roleId: string;

  @ManyToOne(() => RoleTypeOrm, (role) => role.users)
  @JoinTable()
  role?: RoleDTO;

  @Column()
  password?: string;

  @Column({ type: 'boolean' })
  status: boolean;

  @Column({ nullable: true, default: null })
  lastLogin?: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
