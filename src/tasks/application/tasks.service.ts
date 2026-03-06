import { Inject, Injectable } from '@nestjs/common';
import { TasksRepository } from '../domain/repository/tasks.repository';
import { Task } from '../../libs/shared/domain/tasks/entity/task';
import { TaskDTO } from 'src/libs/shared/application/tasks/dto/task.dto';


@Injectable()
export class TasksService {

  constructor(
    @Inject(TasksRepository)
    private readonly tasksRepository: TasksRepository,
  ) { }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.findAll();
  }

  async findOneById(id: string, userId: string): Promise<Task | null> {
    return await this.tasksRepository.findOneById(id, userId);
  }

  async findAllForUserId(id: string): Promise<Task[]> {
    return await this.tasksRepository.findAllForUserId(id);
  }

  async create(task: Task): Promise<Task> {
    return this.tasksRepository.create(TaskDTO.validate(task));
  }

  async update(task: Task): Promise<Task | null> {
    return await this.tasksRepository.update(TaskDTO.validate(task));
  }

  async delete(task: Task): Promise<boolean> {
    return this.tasksRepository.delete(task);
  }
}
