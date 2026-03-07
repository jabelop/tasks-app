import { Task } from 'src/libs/shared/domain/tasks/entity/task';
import UuidV4 from 'src/libs/shared/domain/value-objects/uuid-v4';
import { TaskDescription } from 'src/tasks/domain/value-objects/task-description';
import { TaskStatus } from 'src/tasks/domain/value-objects/task-status';
import { TaskTitle } from 'src/tasks/domain/value-objects/task-title';

export class TaskDTO implements Task {
  id: string;
  title: string;
  description: string;
  status: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;

  static validate(task: TaskDTO): TaskDTO {
    const validatedTask: TaskDTO = new TaskDTO();

    validatedTask.id = new UuidV4(task.id).getValue();
    validatedTask.title = new TaskTitle(task.title).getValue();
    validatedTask.description = new TaskDescription(
      task.description,
    ).getValue();
    validatedTask.status = new TaskStatus(task.status).getValue();
    validatedTask.userId = new UuidV4(task.userId).getValue();
    validatedTask.createdAt = task.createdAt;
    validatedTask.updatedAt = task.updatedAt;

    return validatedTask;
  }
}
