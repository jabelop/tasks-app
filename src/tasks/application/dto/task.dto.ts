import { Task } from "../../domain/entity/task";
import UuidV4 from "../../../libs/shared/domain/value-objects/uuid-v4";
import { TaskTitle } from "../../domain/value-objects/task-title";
import { TaskDescription } from "../../domain/value-objects/task-description";
import { TaskStatus } from "../../domain/value-objects/task-status";

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
    validatedTask.description = new TaskDescription(task.description).getValue();
    validatedTask.status = new TaskStatus(task.status).getValue();
    validatedTask.userId = new UuidV4(task.userId).getValue();
    validatedTask.createdAt = task.createdAt;
    validatedTask.updatedAt = task.updatedAt;

    return validatedTask;
  }
 
}
