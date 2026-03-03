import { Test, TestingModule } from '@nestjs/testing';

import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from '../../../src/users/application/users.service';
import { UsersRepository } from '../../../src/users/domain/repository/users.repository';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '../../../src/config/database.config';
import appConfig from '../../../src/config/app.config';
import cache from '../../../src/config/cache';
import { UsersTestRepository } from '../repository/users-test.repository';


const usersRepositoryProvider = { provide: UsersRepository, useClass: UsersTestRepository };
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, databaseConfig, cache],
        }),
        TypeOrmModule.forRoot(databaseConfig())
      ],
      providers: [UsersService, usersRepositoryProvider],
    }).compile();

    service = module.get<UsersService>(UsersService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all existing users', async () => {
    expect((await service.findAll()).length).toBeTruthy();
  });

  it('should get an existing user by username', async () => {
    expect((await service.findByUsername("test1"))).toBeTruthy();
  });

  it('should get an existing user by email', async () => {
    expect((await service.findOneByEmail("test1@tasks.com"))).toBeTruthy();
  });

});
