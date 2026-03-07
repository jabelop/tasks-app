import { SharedTask } from '../../domain/entity/shared-task';
import UuidV4 from '../../../libs/shared/domain/value-objects/uuid-v4';

export class SharedTaskDTO implements SharedTask {
  taskId: string;
  ownerId: string;
  userId: string;
  createdAt?: Date;

  static validate(sharedTask: SharedTaskDTO): SharedTaskDTO {
    const validatedSharedTask: SharedTaskDTO = new SharedTaskDTO();

    validatedSharedTask.taskId = new UuidV4(sharedTask.taskId).getValue();
    validatedSharedTask.ownerId = new UuidV4(sharedTask.ownerId).getValue();
    validatedSharedTask.userId = new UuidV4(sharedTask.userId).getValue();

    return validatedSharedTask;
  }
}
