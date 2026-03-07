import { Inject, Injectable } from '@nestjs/common';
import { SharedTasksRepository } from '../domain/repository/shared-tasks.repository';
import { SharedTask } from '../domain/entity/shared-task';
import { SharedTaskDTO } from './dto/shared-task.dto';

@Injectable()
export class SharedTasksService {
  constructor(
    @Inject(SharedTasksRepository)
    private readonly sharedTasksRepository: SharedTasksRepository,
  ) {}

  async findAll(): Promise<SharedTask[]> {
    return await this.sharedTasksRepository.findAll();
  }

  async findAllForUserId(id: string): Promise<SharedTask[]> {
    return await this.sharedTasksRepository.findAllForUserId(id);
  }

  async create(sharedTask: SharedTask): Promise<SharedTask> {
    return this.sharedTasksRepository.create(
      SharedTaskDTO.validate(sharedTask),
    );
  }

  async delete(sharedTask: SharedTask): Promise<boolean> {
    return this.sharedTasksRepository.delete(sharedTask);
  }
}
