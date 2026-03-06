import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedTaskDTO } from '../../../src/shared-tasks/application/dto/shared-task.dto';
import { SharedTasksModule } from '../../../src/shared-tasks/shared-tasks.module';
import { SharedTasksService } from '../../../src/shared-tasks/application/shared-tasks.service';
import databaseConfig from '../../../src/config/database.config';
import { TasksModule } from '../../../src/tasks/tasks.module';
import { TasksService } from '../../../src/tasks/application/tasks.service';

describe('TasksService', () => {
  let service: SharedTasksService;
  let tasksService: TasksService;
  let sharedTask: SharedTaskDTO = {
    taskId: "78bb6de0-5fbf-40f8-bbbc-08975c72036e",
    userId: "06c2f397-def1-4ef6-a0a9-476b482b82eb",
    ownerId: "78146de0-5fbf-40f8-b11c-08975c7204da"
  };

  let task = {
    id: "78bb6de0-5fbf-40f8-bbbc-08975c72036e",
    title: "Task Integration",
    description: "Description task integration",
    status: "not completed",
    userId: "78146de0-5fbf-40f8-b11c-08975c7204da"
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TasksModule,
        SharedTasksModule,
        TypeOrmModule.forRoot(databaseConfig()),
      ]
    }).compile();

    service = module.get<SharedTasksService>(SharedTasksService);
    tasksService = module.get<TasksService>(TasksService);
    await service.delete(sharedTask);
    await tasksService.delete(task);
    await tasksService.create(task);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save an shared task', async () => {
    expect((await service.create(sharedTask))).toMatchObject(sharedTask);
  });


  it('should get all the shared tasks for the exisiting "user" user', async () => {
    expect((await service.findAllForUserId('06c2f397-def1-4ef6-a0a9-476b482b82eb')).length)
      .toBeGreaterThan(0);
  });


  afterAll(() => {
    service.delete(sharedTask);
    tasksService.delete(task);
  });
});
