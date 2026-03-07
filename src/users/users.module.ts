import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleTypeOrm } from '../libs/shared/infrastructure/roles/entity/role-typeorm.entity';
import { UsersController } from './infrastructure/users.controller';
import { UsersService } from './application/users.service';
import { UserTypeOrm } from '../libs/shared/infrastructure/users/entity/user-typeorm.entity';
import { UsersRepository } from './domain/repository/users.repository';
import { UsersTypeOrmRepository } from './infrastructure/repository/users-typeorm.repository';

const usersRepositoryProvider = {
  provide: UsersRepository,
  useClass: UsersTypeOrmRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrm, RoleTypeOrm])],
  controllers: [UsersController],
  providers: [UsersService, usersRepositoryProvider],
  exports: [UsersService],
})
export class UsersModule {}
