import {
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { SharedTaskDTO } from '../../application/dto/shared-task.dto';
import { UserTypeOrm } from 'src/libs/shared/infrastructure/users/entity/user-typeorm.entity';
import { UserDTO } from 'src/libs/shared/application/users/dto/user.dto';
import { TaskTypeOrm } from 'src/libs/shared/infrastructure/tasks/entity/task-typeorm.entity';
import { TaskDTO } from 'src/libs/shared/application/tasks/dto/task.dto';

@Entity('shared-tasks')
export class SharedTaskTypeOrm extends SharedTaskDTO {
  @PrimaryColumn({ type: 'uuid' })
  taskId: string;

  @PrimaryColumn({ type: 'uuid' })
  ownerId: string;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @CreateDateColumn()
  createdAt?: Date;

  @ManyToOne(() => UserTypeOrm, (user) => user.sharedTasks)
  @JoinTable()
  user?: UserDTO;

  @ManyToOne(() => TaskTypeOrm, (task) => task.sharedTasks)
  @JoinTable()
  task?: TaskDTO;
}
