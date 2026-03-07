import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from 'src/auth/application/auth.service';
import { randomUUID } from 'crypto';
import { TokenModule } from 'src/libs/token/src';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from 'src/config/database.config';
import appConfig from 'src/config/app.config';
import cache from 'src/config/cache';
import { UnauthorizedException } from '@nestjs/common';
import BadUuid from 'src/libs/shared/domain/exceptions/bad-uuid.exception';
import { AuthRepository } from 'src/auth/domain/repository/auth.repository';
import { AuthRepositoryTest } from '../repository/authRespositoryTest';
import InvalidPassword from 'src/libs/shared/domain/exceptions/users/invalid-password.exception';
import InvalidEmail from 'src/libs/shared/domain/exceptions/users/invalid-email.exception';
import InvalidName from 'src/libs/shared/domain/exceptions/users/invalid-name.exception';

const authRepositoryProvider = {
  provide: AuthRepository,
  useClass: AuthRepositoryTest,
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, databaseConfig, cache],
        }),
        TokenModule,
        TypeOrmModule.forRoot(databaseConfig()),
      ],
      providers: [AuthService, authRepositoryProvider],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login an existing user', async () => {
    expect((await service.login('test2', 'test2Password')).token).toBeTruthy();
  });

  it('should not login a non existing user', async () => {
    try {
      await service.login('test1', 'secret');
      expect(true).toBe(false);
    } catch (e) {
      expect(e instanceof UnauthorizedException).toBe(true);
    }
  });

  it('should refresh token for an existing user', async () => {
    expect(
      (
        await service.refreshToken({
          id: '78146de0-5fbf-40f8-b11c-08975c72036e',
          name: 'Test1',
          email: 'test1@tasks.com',
          roleId: randomUUID(),
          subscriptionId: '06c2f397-def1-3336-a0a9-476b482b80eb',
          status: true,
          username: 'test1',
          password: 'test1Password',
        })
      ).token,
    ).toBeTruthy();
  });

  it('should not refresh token for a non existing user', async () => {
    try {
      await service.refreshToken({
        id: '78146de0-5fbf-40f8-b11c-08975c720361',
        name: 'Test3',
        email: 'test3@tasks.com',
        roleId: randomUUID(),
        status: true,
        subscriptionId: '06c2f397-def1-3336-a0a9-476b482b80eb',
        role: {
          id: randomUUID(),
          permissions: '',
          name: 'User',
          status: true,
        },
        username: 'test3',
        password: 'test3Password',
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e instanceof UnauthorizedException).toBe(true);
    }
  });

  it('should signup valid user', async () => {
    const user = await service.signup({
      id: '76146de0-5fbf-40f8-b11c-08975c720361',
      name: 'Test3',
      email: 'test3@tasks.com',
      roleId: randomUUID(),
      status: true,
      subscriptionId: '06c2f397-def1-3336-a0a9-476b482b80eb',
      username: 'test3',
      password: 'test3Password',
    });
    expect(
      user.id === '76a146de0-5fbf-40f8-b11c-08975c720361' &&
        user.email === 'test3@tasks.com',
    ).toBe(false);
  });

  it('should throw an error for a non valid id on signup', async () => {
    try {
      await service.signup({
        id: '146de0-5fbf-40f8-b11c-08975c720361',
        name: 'Test3',
        email: 'test3@tasks.com',
        roleId: randomUUID(),
        status: true,
        subscriptionId: '06c2f397-def1-3336-a0a9-476b482b80eb',
        username: 'test3',
        password: 'test3Password',
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e instanceof BadUuid).toBe(true);
    }
  });

  it('should throw an error for a non valid name on signup', async () => {
    try {
      await service.signup({
        id: '76146de0-5fbf-40f8-b11c-08975c720361',
        name: 'Te',
        email: 'test3@tasks.com',
        roleId: randomUUID(),
        status: true,
        subscriptionId: '06c2f397-def1-3336-a0a9-476b482b80eb',
        username: 'test3',
        password: 'test3Password',
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e instanceof InvalidName).toBe(true);
    }
  });

  it('should throw an error for a non valid email on signup', async () => {
    try {
      await service.signup({
        id: '76146de0-5fbf-40f8-b11c-08975c720361',
        name: 'Test3',
        email: 'test3@tasks',
        roleId: randomUUID(),
        status: true,
        subscriptionId: '06c2f397-def1-3336-a0a9-476b482b80eb',
        username: 'test3',
        password: 'test3Password',
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e instanceof InvalidEmail).toBe(true);
    }
  });

  it('should throw an error for a non valid password on signup', async () => {
    try {
      await service.signup({
        id: '76146de0-5fbf-40f8-b11c-08975c720361',
        name: 'Test3',
        email: 'test3@tasks.es',
        roleId: randomUUID(),
        status: true,
        subscriptionId: '06c2f397-def1-3336-a0a9-476b482b80eb',
        username: 'test3',
        password: 'test',
      });
      expect(true).toBe(false);
    } catch (e) {
      expect(e instanceof InvalidPassword).toBe(true);
    }
  });
});
