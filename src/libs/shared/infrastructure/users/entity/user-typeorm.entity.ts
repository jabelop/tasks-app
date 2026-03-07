import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RoleTypeOrm } from '../../roles/entity/role-typeorm.entity';
import { UserDTO } from 'src/libs/shared/application/users/dto/user.dto';
import { SharedTaskTypeOrm } from 'src/shared-tasks/infrastructure/entity/shared-task-typeorm.entity';
import { TaskTypeOrm } from 'src/libs/shared/infrastructure/tasks/entity/task-typeorm.entity';
import { SubscriptionTypeOrm } from '../../subscriptions/subscription-typeorm.entity';

@Entity('users')
export class UserTypeOrm extends UserDTO {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true, length: 20 })
  username: string;

  @Column({ unique: true, length: 300 })
  email: string;

  @Column({ type: 'uuid' })
  roleId: string;

  @Column({ length: 256 })
  password?: string;

  @Column({ type: 'boolean' })
  status: boolean;

  @Column({ type: 'uuid' })
  subscriptionId: string;

  @Column({ nullable: true, default: null })
  lastLogin?: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => RoleTypeOrm, (role) => role.users)
  @JoinTable()
  role?: RoleTypeOrm;

  @OneToMany(() => TaskTypeOrm, (task) => task.user)
  @JoinTable()
  tasks: TaskTypeOrm[];

  @OneToMany(() => SharedTaskTypeOrm, (sharedTask) => sharedTask.user)
  @JoinTable()
  sharedTasks: SharedTaskTypeOrm[];

  @ManyToOne(() => SubscriptionTypeOrm, (subscription) => subscription.users)
  @JoinTable()
  subscription?: SubscriptionTypeOrm;
}
