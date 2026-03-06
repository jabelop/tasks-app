import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';


import { SharedTaskNotFoundException } from '../exceptions/shared-task-not-found-exception';
import { SharedTasksRepository } from '../../domain/repository/shared-tasks.repository';
import { SharedTaskTypeOrm } from '../entity/shared-task-typeorm.entity';


@Injectable()
export class SharedTasksTypeOrmRepository implements SharedTasksRepository {
  constructor(
    @InjectRepository(SharedTaskTypeOrm)
    private readonly sharedTasksRepository: Repository<SharedTaskTypeOrm>,
  ) { }

  async findAll(): Promise<SharedTaskTypeOrm[]> {
    return this.sharedTasksRepository.find({ relations: { task: true } });
  }

  async findAllForUserId(id: string): Promise<SharedTaskTypeOrm[]> {
    return this.sharedTasksRepository.find({
      where: [
        { userId: id },
        { ownerId: id },
      ],
      relations: { task: true },
    });
  }

  async create(sharedTask: SharedTaskTypeOrm): Promise<SharedTaskTypeOrm> {
    const now = new Date();

    return this.sharedTasksRepository.save(
      this.sharedTasksRepository.create({
        ...sharedTask,
        createdAt: now,
      }),
    );
  }


  async delete(sharedTask: SharedTaskTypeOrm): Promise<boolean> {
    const result = await this.sharedTasksRepository.delete({
      taskId: sharedTask.taskId,
      userId: sharedTask.userId,
      ownerId: sharedTask.ownerId
    })
    return result.affected === 1;
  }
}
