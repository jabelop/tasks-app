import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskDTO } from '../../../src/libs/shared/application/tasks/dto/task.dto';
import { TasksModule } from '../../../src/tasks/tasks.module';
import { TasksService } from '../../../src/tasks/application/tasks.service';
import databaseConfig from '../../../src/config/database.config';

describe('TasksService', () => {
  let service: TasksService;
  let task: TaskDTO = {
    id: "78146de0-5fbf-4558-b11c-08975c72036e",
    title: "Task3",
    description: "Description task 3",
    status: "completed",
    userId: "06c2f397-def1-4ef6-a0a9-476b482b82eb"
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TasksModule,
        TypeOrmModule.forRoot(databaseConfig()),
      ]
    }).compile();

    service = module.get<TasksService>(TasksService);
    service.delete(task);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save an task', async () => {
    expect((await service.create(task)).id).toBe(task.id);
  });


  it('should get all the tasks for the exisiting "user" user', async () => {
    expect((await service.findAllForUserId('06c2f397-def1-4ef6-a0a9-476b482b82eb')).length)
      .toBeGreaterThan(0);
  });

  it('should update an task by id', async () => {
    task.title = 'Test3Updated'
    expect((
      await service.update(task)
    )?.title
    ).toBe('Test3Updated');
  });


  afterAll(() => {
    service.delete(task);
  });
});
