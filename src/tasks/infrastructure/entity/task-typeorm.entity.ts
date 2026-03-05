import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserDTO } from 'src/libs/shared/application/users/dto/user.dto';
import { TaskDTO } from 'src/tasks/application/dto/task.dto';
import { UserTypeOrm } from 'src/libs/shared/infrastructure/users/entity/user-typeorm.entity';

@Entity('tasks')
export class TaskTypeOrm extends TaskDTO {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({length: 100})
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
}
