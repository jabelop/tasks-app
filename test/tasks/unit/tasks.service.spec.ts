import { Test, TestingModule } from '@nestjs/testing';

import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksService } from '../../../src/tasks/application/tasks.service';
import { TasksRepository } from '../../../src/tasks/domain/repository/tasks.repository';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '../../../src/config/database.config';
import appConfig from '../../../src/config/app.config';
import cache from '../../../src/config/cache';
import { TasksTestRepository } from '../repository/tasks-test.repository';
import BadUuid from '../../../src/libs/shared/domain/exceptions/bad-uuid.exception';
import InvalidTaskTitle from 'src/tasks/domain/exceptions/invalid-task-title.exception';
import InvalidTaskDescription from 'src/tasks/domain/exceptions/invalid-task-description.exception';
import InvalidTaskStatus from 'src/tasks/domain/exceptions/invalid-task-status.exception';

const tasksRepositoryProvider = {
  provide: TasksRepository,
  useClass: TasksTestRepository,
};
describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, databaseConfig, cache],
        }),
        TypeOrmModule.forRoot(databaseConfig()),
      ],
      providers: [TasksService, tasksRepositoryProvider],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all existing tasks', async () => {
    expect((await service.findAll()).length).toBeTruthy();
  });

  it('should get all existing tasks for an exisiting userId', async () => {
    expect(
      await service.findAllForUserId('78146de0-5fbf-40f8-b11c-08975c7204da'),
    ).toMatchObject([
      {
        id: '78146de0-5fbf-40f8-b11c-08975c72036e',
        title: 'Task1',
        description: 'Description task 1',
        status: 'not completed',
        userId: '78146de0-5fbf-40f8-b11c-08975c7204da',
      },
      {
        id: '78146de0-5fbf-4558-b11c-08975c72036e',
        title: 'Task3',
        description: 'Description task 3',
        status: 'completed',
        userId: '78146de0-5fbf-40f8-b11c-08975c7204da',
      },
    ]);
  });

  it('should get no tasks for a non exisiting userId', async () => {
    expect(
      (await service.findAllForUserId('78146de0-5fbf-40f8-b11c-08975c7204d0'))
        .length,
    ).toBeFalsy();
  });

  it('should create a valid task', async () => {
    expect(
      await service.create(
        {
          id: '78146de0-5fbf-4558-b11c-08970072036e',
          title: 'TaskNew',
          description: 'Description task new',
          status: 'not completed',
          userId: '78146de0-5fbf-40f8-b11c-08975c7204d0',
        },
        1000,
      ),
    ).toMatchObject({
      id: '78146de0-5fbf-4558-b11c-08970072036e',
      title: 'TaskNew',
      description: 'Description task new',
      status: 'not completed',
      userId: '78146de0-5fbf-40f8-b11c-08975c7204d0',
    });
  });

  it('should throw BadUUID error creating a task with invalid uuidv4', async () => {
    try {
      await service.create(
        {
          id: '78146e0-5fbf-4558-b11c-08970072036e',
          title: 'TaskNew',
          description: 'Description task new',
          status: 'not completed',
          userId: '78146de0-5fbf-40f8-b11c-08975c7204d0',
        },
        1000,
      );
      expect(true).toBe(true);
    } catch (e) {
      expect(e instanceof BadUuid).toBe(true);
    }
  });

  it('should throw InvalidTaskTitle error creating a task with invalid title', async () => {
    try {
      await service.create(
        {
          id: '78146de0-5fbf-4558-b11c-08970072036e',
          title: 'Ta',
          description: 'Description task new',
          status: 'not completed',
          userId: '78146de0-5fbf-40f8-b11c-08975c7204d0',
        },
        1000,
      );
      expect(true).toBe(true);
    } catch (e) {
      expect(e instanceof InvalidTaskTitle).toBe(true);
    }
  });

  it('should throw InvalidTaskDescription error creating a task with invalid description', async () => {
    try {
      await service.create(
        {
          id: '78146de0-5fbf-4558-b11c-08970072036e',
          title: 'TaskCreationError',
          description: 'a'.repeat(501),
          status: 'not completed',
          userId: '78146de0-5fbf-40f8-b11c-08975c7204d0',
        },
        1000,
      );
      expect(true).toBe(true);
    } catch (e) {
      expect(e instanceof InvalidTaskDescription).toBe(true);
    }
  });

  it('should update an existing a valid task', async () => {
    expect(
      await service.update({
        id: '78146de0-5fbf-40f8-b11c-08975c72036b',
        title: 'Task2Edited',
        description: 'Description task 2 edited',
        status: 'completed',
        userId: '78146de0-5fbf-40f8-b11c-b3875c72036b',
      }),
    ).toMatchObject({
      id: '78146de0-5fbf-40f8-b11c-08975c72036b',
      title: 'Task2Edited',
      description: 'Description task 2 edited',
      status: 'completed',
      userId: '78146de0-5fbf-40f8-b11c-b3875c72036b',
    });
  });

  it('should throw an InvalidTaskStatus for an updating a task with wrong status', async () => {
    try {
      await service.update({
        id: '78146de0-5fbf-40f8-b11c-08975c72036b',
        title: 'Task2Edited',
        description: 'Description task 2 edited',
        status: 'forbidden',
        userId: '78146de0-5fbf-40f8-b11c-b3875c72036b',
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e instanceof InvalidTaskStatus).toBe(true);
    }
  });

  it('should delete an existing a valid task', async () => {
    expect(
      await service.delete({
        id: '78146de0-5fbf-3af8-b11c-08975c72036b',
        title: 'Task4',
        description: 'Description task 4',
        status: 'completed',
        userId: '78146de0-5fbf-4008-b11c-b3875c72036b',
      }),
    ).toBe(true);
  });
});
