import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksTypeOrmRepository } from './infrastructure/repository/tasks-typeorm.repository';
import { TasksService } from './application/tasks.service';
import { TasksRepository } from './domain/repository/tasks.repository';
import { TasksController } from './infrastructure/tasks.controller';
import { TaskTypeOrm } from '../libs/shared/infrastructure/tasks/entity/task-typeorm.entity';

const tasksRepositoryProvider = {
  provide: TasksRepository,
  useClass: TasksTypeOrmRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([TaskTypeOrm])],
  controllers: [TasksController],
  providers: [TasksService, tasksRepositoryProvider],
  exports: [],
})
export class TasksModule {}
