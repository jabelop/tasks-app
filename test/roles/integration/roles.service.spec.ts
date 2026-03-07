import { Test, TestingModule } from '@nestjs/testing';

import { RolesModule } from '../../../src/roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleTypeOrm } from '../../../src/libs/shared/infrastructure/roles/entity/role-typeorm.entity';
import databaseConfig from '../../../src/config/database.config';
import { RolesService } from '../../../src/roles/application/roles.service';
import { RoleDTO } from '../../../src/libs/shared/application/roles/dto/role';

describe('RolesService', () => {
  let service: RolesService;
  const role: RoleDTO = {
    id: '78146de0-5fbf-40f8-b11c-08933c72c06b',
    name: 'Role3',
    permissions: JSON.stringify(['permission3']),
    status: true,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RolesModule,
        TypeOrmModule.forRoot(databaseConfig()),
        TypeOrmModule.forFeature([RoleTypeOrm]),
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    service.delete(role);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save a role', async () => {
    expect((await service.create(role)).id).toBe(role.id);
  });

  it('should get a role by id', async () => {
    expect((await service.findOneById(role.id))?.id).toBe(role.id);
  });

  it('should update a role by id', async () => {
    role.name = 'Role3Updated';
    expect((await service.update(role)).id).toBe(role.id);
  });

  afterAll(() => {
    service.delete(role);
  });
});
