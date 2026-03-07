import { Injectable } from '@nestjs/common';
import { SharedTasksRepository } from '../../../src/shared-tasks/domain/repository/shared-tasks.repository';
import { SharedTask } from '../../../src/shared-tasks/domain/entity/shared-task';

@Injectable()
export class SharedTasksTestRepository implements SharedTasksRepository {
  sharedTasks: SharedTask[] = [
    {
      taskId: '78146de0-5fbf-40f8-b11c-08975c72036e',
      userId: '78146de0-5fbf-40f8-b11c-08975c7204da',
      ownerId: '66146de0-5fbf-40f8-b11c-08975c7204da',
    },
    {
      taskId: '78146de0-5fbf-40f8-baac-08975c72036e',
      userId: '66146de0-5fbf-40f8-b11c-08975c7204da',
      ownerId: '78146de0-5fbf-40f8-b11c-08975c7204da',
    },
    {
      taskId: '78146de0-5fbf-40f8-bbbc-08975c72036e',
      userId: '66146de0-5fbf-4000-b11c-08975c7204da',
      ownerId: '78146de0-5fbf-40f8-b11c-08975c7204da',
    },
    {
      taskId: '78146de0-5fbf-40f8-cccc-08975c72036e',
      userId: '66146de0-5fbf-4000-b11c-08975c720111',
      ownerId: '66146de0-5fbf-4000-b11c-08975c7204da',
    },
  ];
  constructor() {}

  async findAll(): Promise<SharedTask[]> {
    return this.sharedTasks;
  }

  async findAllForUserId(id: string): Promise<SharedTask[]> {
    return this.sharedTasks.filter((sharedTask) => sharedTask.userId === id);
  }

  async create(sharedTask: SharedTask): Promise<SharedTask> {
    this.sharedTasks.push(sharedTask);
    return sharedTask;
  }

  async delete(sharedTask: SharedTask): Promise<boolean> {
    const indexToUpdate = this.sharedTasks.findIndex(
      (shrdTsk) =>
        shrdTsk.taskId === sharedTask.taskId &&
        shrdTsk.ownerId === sharedTask.ownerId &&
        shrdTsk.userId === sharedTask.userId,
    );

    if (indexToUpdate < 0) return false;
    this.sharedTasks.splice(indexToUpdate, 1);
    return true;
  }
}
