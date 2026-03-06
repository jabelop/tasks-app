import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { TaskNotFoundException } from '../exceptions/task-not-found-exception';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from 'src/tasks/domain/repository/tasks.repository';
import { TaskTypeOrm } from '../../../libs/shared/infrastructure/tasks/entity/task-typeorm.entity';
import { Task } from 'src/libs/shared/domain/tasks/entity/task';

@Injectable()
export class TasksTypeOrmRepository implements TasksRepository {
  constructor(
    @InjectRepository(TaskTypeOrm)
    private readonly tasksRepository: Repository<TaskTypeOrm>,
  ) { }

  async findAll(): Promise<TaskTypeOrm[]> {
    return this.tasksRepository.find({ relations: { user: true } });
  }

  async findAllForUserId(id: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { userId: id }
    });
  }

  async findOneById(id: string, userId: string): Promise<TaskTypeOrm | null> {
    const task = await this.tasksRepository.findOne({
      where: {
        id: id,
        userId: userId
      },
      relations: {
        user: true,
      },
    });

    if (!task) {
      throw new TaskNotFoundException();
    }

    return task;
  }

  async create(task: TaskTypeOrm): Promise<TaskTypeOrm> {
    const now = new Date();

    return this.tasksRepository.save(
      this.tasksRepository.create({
        id: uuid(),
        ...task,
        createdAt: now,
        updatedAt: now,
      }),
    );
  }

  async update(task: TaskTypeOrm): Promise<TaskTypeOrm | null> {

   const result = await this.tasksRepository.update({ id: task.id }, task);

    return result.affected === 1 ? task : null;
  }

  async delete(task: TaskTypeOrm): Promise<boolean> {
    const result = await this.tasksRepository.delete({ id: task.id })
    return result.affected === 1;
  }
}
