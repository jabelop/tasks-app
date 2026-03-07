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

import { UserDTO } from 'src/libs/shared/application/users/dto/user.dto';
import { UserTypeOrm } from 'src/libs/shared/infrastructure/users/entity/user-typeorm.entity';
import { SharedTaskTypeOrm } from 'src/shared-tasks/infrastructure/entity/shared-task-typeorm.entity';
import { TaskDTO } from 'src/libs/shared/application/tasks/dto/task.dto';

@Entity('tasks')
export class TaskTypeOrm extends TaskDTO {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 500 })
  description: string;

  @Column()
  status: string;

  @Column({ type: 'uuid' })
  userId: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => UserTypeOrm, (user) => user.tasks)
  @JoinTable()
  user?: UserDTO;

  @OneToMany(() => SharedTaskTypeOrm, (sharedTask) => sharedTask.task)
  @JoinTable()
  sharedTasks?: SharedTaskTypeOrm[];
}
