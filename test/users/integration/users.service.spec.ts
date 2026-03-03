import { Test, TestingModule } from '@nestjs/testing';

import { UserDTO } from 'src/libs/shared/application/users/dto/user.dto';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/application/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleTypeOrm } from 'src/libs/shared/infrastructure/roles/entity/role-typeorm.entity';
import databaseConfig from 'src/config/database.config';

describe('UsersService', () => {
  let service: UsersService;
  let user: UserDTO = {
    id: '78146de0-5fbf-40f8-b11c-08975c72036e',
    name: "Test1",
    email: "test1@tasks.com",
    roleId: "88794539-fa73-4ea2-b6ea-84972837caf6",
    role: {
      id: "88794539-fa73-4ea2-b6ea-84972837caf6",
      permissions: '',
      name: 'Admin',
      status: true,
    },
    status: true,
    username: "test1",
    password: "test1Password"
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot(databaseConfig()),
        TypeOrmModule.forFeature([RoleTypeOrm])
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
    service.delete(user);
    service
    .findAll()
    .then(users => {
      user.role = users[0].role;
      user.roleId = user.role.id;
    })

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save an user', async () => {
    expect((await service.create(user)).id).toBe(user.id);
  });


  it('should get an user by id', async () => {
    expect((await service.findOneById(user.id)).id).toBe(user.id);
  });

  it('should update an user by id', async () => {
    user.name = 'Test1Updated'
    expect((
      await service.update(user)
    ).id
  ).toBe(user.id);
  });


  afterAll(() => {
    service.delete(user);
  });
});
