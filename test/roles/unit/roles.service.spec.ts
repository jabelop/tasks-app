import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import databaseConfig from '../../../src/config/database.config';
import appConfig from '../../../src/config/app.config';
import cache from '../../../src/config/cache';
import { RolesRepository } from '../../../src/roles/domain/repository/roles.repository';
import { RolesService } from '../../../src/roles/application/roles.service';
import { RolesTestRepository } from '../repository/roles-test.repository';
import BadUuid from '../../../src/libs/shared/domain/exceptions/bad-uuid.exception';
import InvalidName from '../../../src/libs/shared/domain/exceptions/invalid-name.exception';



const rolesRepositoryProvider = { provide: RolesRepository, useClass: RolesTestRepository };
describe('RolesService', () => {
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, databaseConfig, cache],
        }),
        TypeOrmModule.forRoot(databaseConfig())
      ],
      providers: [RolesService, rolesRepositoryProvider],
    }).compile();

    service = module.get<RolesService>(RolesService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all existing users', async () => {
    expect((await service.find()).length).toBeTruthy();
  });

  it('should get an existing user by id', async () => {
    expect((await service.findOneById("78146de0-5fbf-40f8-b11c-08975c72036e"))).toBeTruthy();
  });

  it('should save a role with good data', async () => {
    expect((await service.create({
      id: '78146de0-5fbf-40f8-b11c-08975c72036b',
      name: "Role2",
      permissions: '[permission2]',
      status: true,
    },)).id)
      .toBe('78146de0-5fbf-40f8-b11c-08975c72036b');
  });

  it('should not save a role with bad id', async () => {
    try {
      expect((await service.create({
        id: '78146de0-5fbf-40f8-bc-08975c72036b',
        name: "Role2",
        permissions: '[permission2]',
        status: true,
      },)));
      expect(true).toBe(false);
    } catch (e) {
      expect(e instanceof BadUuid)
    }

  });

  it('should update a role with good data', async () => {
    expect((await service.create({
      id: '78146de0-5fbf-40f8-b11c-08975c72036b',
      name: "Role2Updated",
      permissions: '[permission2]',
      status: true,
    },)).name)
      .toBe('Role2Updated');
  });

  it('should not save a role with bad name', async () => {
    try {
      expect((await service.create({
        id: '78146de0-5fbf-40f8-bc-08975c72036b',
        name: "Ro",
        permissions: '[permission2]',
        status: true,
      },)));
      expect(true).toBe(false);
    } catch (e) {
      expect(e instanceof InvalidName)
    }

  });

});
