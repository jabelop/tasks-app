import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from 'src/auth/application/auth.service';
import { UsersRepository } from 'src/users/domain/repository/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from 'src/config/database.config';
import { UserDTO } from 'src/libs/shared/application/users/dto/user.dto';
import { UsersTypeOrmRepository } from 'src/users/infrastructure/repository/users-typeorm.repository';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from 'src/libs/token/src';
import appConfig from 'src/config/app.config';
import cache from 'src/config/cache';
import { UserTypeOrm } from 'src/libs/shared/infrastructure/users/entity/user-typeorm.entity';
import { HashModule } from 'src/libs/hash/src';
import { AuthRepository } from 'src/auth/domain/repository/auth.repository';
import { AuthTypeOrmRepository } from 'src/auth/infrastructure/repository/auth-typeorm.repository';
import { Permissions } from 'src/libs/shared/application/permissions/permissions';

const usersRepositoryProvider = {
  provide: UsersRepository,
  useClass: UsersTypeOrmRepository,
};

const authRepositoryProvider = {
  provide: AuthRepository,
  useClass: AuthTypeOrmRepository,
};

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository: UsersRepository;
  const user: UserDTO = {
    id: '78146de0-5fbf-40f8-b11c-08975c72036e',
    name: 'Test1',
    email: 'test1@tasks.com',
    roleId: '06c2f397-def1-3336-a0a9-476b482b82eb',
    subscriptionId: '06c2f397-def1-3336-a0a9-476b482b80eb',
    role: {
      id: '06c2f397-def1-3336-a0a9-476b482b82eb',
      permissions: JSON.stringify([
        Permissions.ROLES_VIEW,
        Permissions.ROLES_MANAGE,
      ]),
      name: 'Admin',
      status: true,
    },
    status: true,
    username: 'test1',
    password: 'test1Password',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, databaseConfig, cache],
        }),
        TokenModule,
        HashModule,
        TypeOrmModule.forRoot(databaseConfig()),
        TypeOrmModule.forFeature([UserTypeOrm]),
      ],
      providers: [AuthService, authRepositoryProvider, usersRepositoryProvider],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    usersRepository.delete(user);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save an user', async () => {
    expect((await usersRepository.create(user)).id).toBe(user.id);
  });

  afterAll(async () => {
    expect((await service.login('test1', 'test1Password')).token).toBeTruthy();
    usersRepository.delete(user);
  });
});
