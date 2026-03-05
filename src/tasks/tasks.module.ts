import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksTypeOrmRepository } from './infrastructure/repository/tasks-typeorm.repository';
import { TasksService } from './application/tasks.service';
import { TasksRepository } from './domain/repository/tasks.repository';
import { TasksController } from './infrastructure/tasks.controller';
import { TaskTypeOrm } from './infrastructure/entity/task-typeorm.entity';

const usersRepositoryProvider = {
  provide: TasksRepository,
  useClass: TasksTypeOrmRepository
};

@Module({
  imports: [TypeOrmModule.forFeature([TaskTypeOrm])],
  controllers: [TasksController],
  providers: [TasksService, usersRepositoryProvider],
  exports: [],
})
export class TasksModule {}
