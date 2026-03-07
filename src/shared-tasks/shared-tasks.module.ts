import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedTasksRepository } from './domain/repository/shared-tasks.repository';
import { SharedTasksTypeOrmRepository } from './infrastructure/repository/shared-tasks-typeorm.repository';
import { SharedTaskTypeOrm } from './infrastructure/entity/shared-task-typeorm.entity';
import { SharedTasksController } from './infrastructure/shared.tasks.controller';
import { SharedTasksService } from './application/shared-tasks.service';

const sharedTasksRepositoryProvider = {
  provide: SharedTasksRepository,
  useClass: SharedTasksTypeOrmRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([SharedTaskTypeOrm])],
  controllers: [SharedTasksController],
  providers: [SharedTasksService, sharedTasksRepositoryProvider],
  exports: [],
})
export class SharedTasksModule {}
