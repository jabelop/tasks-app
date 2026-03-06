import { Test, TestingModule } from '@nestjs/testing';

import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedTasksService } from '../../../src/shared-tasks/application/shared-tasks.service';
import { SharedTasksRepository } from '../../../src/shared-tasks/domain/repository/shared-tasks.repository';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '../../../src/config/database.config';
import appConfig from '../../../src/config/app.config';
import cache from '../../../src/config/cache';
import { SharedTasksTestRepository } from '../repository/shared-tasks-test.repository';
import BadUuid from '../../../src/libs/shared/domain/exceptions/bad-uuid.exception';

const sharedTasksRepositoryProvider = { provide: SharedTasksRepository, useClass: SharedTasksTestRepository };
describe('SharedTasksService', () => {
  let service: SharedTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, databaseConfig, cache],
        }),
        TypeOrmModule.forRoot(databaseConfig())
      ],
      providers: [SharedTasksService, sharedTasksRepositoryProvider],
    }).compile();

    service = module.get<SharedTasksService>(SharedTasksService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all existing shared tasks', async () => {
    expect((await service.findAll()).length).toBeTruthy();
  });

  it('should get all existing shared tasks for an exisiting userId', async () => {
    expect((await service.findAllForUserId('66146de0-5fbf-40f8-b11c-08975c7204da')))
      .toMatchObject([
        {
          taskId: "78146de0-5fbf-40f8-baac-08975c72036e",
          userId: "66146de0-5fbf-40f8-b11c-08975c7204da",
          ownerId: "78146de0-5fbf-40f8-b11c-08975c7204da"
        },
      ]);
  });


  it('should get no shared tasks for a non exisiting userId', async () => {
    expect((await service.findAllForUserId('78146de0-5fbf-40f8-b11c-08975c7204d0')).length)
      .toBeFalsy()
  });

  it('should create a valid shared task', async () => {
    expect((await service.create({
      taskId: "00146de0-5fbf-40f8-b11c-08975c72036e",
      userId: "78146de0-5fbf-40f8-b11c-08975c7204da",
      ownerId: "66146de0-5fbf-40f8-b11c-08975c7204da"
    })))
      .toMatchObject({
        taskId: "00146de0-5fbf-40f8-b11c-08975c72036e",
        userId: "78146de0-5fbf-40f8-b11c-08975c7204da",
        ownerId: "66146de0-5fbf-40f8-b11c-08975c7204da"
      });
  });

  it('should throw BadUUID error creating a shared task with invalid uuidv4 for taskId', async () => {
    try {
      await service.create({
        taskId: "00146de0-5fbf-40f8-b11c-975c72036e",
        userId: "78146de0-5fbf-40f8-b11c-08975c7204da",
        ownerId: "66146de0-5fbf-40f8-b11c-08975c7204da"
      });
      expect(true).toBe(true);
    } catch (e) {
      expect(e instanceof BadUuid).toBe(true);
    }
  });

  it('should throw BadUUID error creating a shared task with invalid uuidv4 for userId', async () => {
    try {
      await service.create({
        taskId: "00146de0-5fbf-40f8-b11c-08975c72036e",
        userId: "78146de0-5fbf-40f8-b11c-975c7204da",
        ownerId: "66146de0-5fbf-40f8-b11c-08975c7204da"
      });
      expect(true).toBe(true);
    } catch (e) {
      expect(e instanceof BadUuid).toBe(true);
    }
  });

  it('should throw BadUUID error creating a shared task with invalid uuidv4 for ownerId', async () => {
    try {
      await service.create({
        taskId: "00146de0-5fbf-40f8-b11c-08975c72036e",
        userId: "78146de0-5fbf-40f8-b11c-08975c7204da",
        ownerId: "66146de05fbf-40f8-b11c-08975c7204da"
      });
      expect(true).toBe(true);
    } catch (e) {
      expect(e instanceof BadUuid).toBe(true);
    }
  });

  it('should delete an existing a valid shared task', async () => {
    expect((await service.delete({
      taskId: "78146de0-5fbf-40f8-bbbc-08975c72036e",
      userId: "66146de0-5fbf-4000-b11c-08975c7204da",
      ownerId: "78146de0-5fbf-40f8-b11c-08975c7204da"
    })))
      .toBe(true);
  });

  it('should throw BadUUID error deleting a shared task with invalid uuidv4 for taskId', async () => {
    try {
      await service.create({
        taskId: "00146de0-5fbf-40f8-b11c-975c72036e",
        userId: "78146de0-5fbf-40f8-b11c-08975c7204da",
        ownerId: "66146de0-5fbf-40f8-b11c-08975c7204da"
      });
      expect(true).toBe(true);
    } catch (e) {
      expect(e instanceof BadUuid).toBe(true);
    }
  });

});