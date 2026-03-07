import { Injectable } from '@nestjs/common';
import { Task } from '../../../src/libs/shared/domain/tasks/entity/task';
import { TasksRepository } from '../../../src/tasks/domain/repository/tasks.repository';

@Injectable()
export class TasksTestRepository implements TasksRepository {
  tasks: Task[] = [
    {
      id: '78146de0-5fbf-40f8-b11c-08975c72036e',
      title: 'Task1',
      description: 'Description task 1',
      status: 'not completed',
      userId: '78146de0-5fbf-40f8-b11c-08975c7204da',
    },
    {
      id: '78146de0-5fbf-40f8-b11c-08975c72036b',
      title: 'Task2',
      description: 'Description task 2',
      status: 'completed',
      userId: '78146de0-5fbf-40f8-b11c-b3875c72036b',
    },
    {
      id: '78146de0-5fbf-4558-b11c-08975c72036e',
      title: 'Task3',
      description: 'Description task 3',
      status: 'completed',
      userId: '78146de0-5fbf-40f8-b11c-08975c7204da',
    },
    {
      id: '78146de0-5fbf-3af8-b11c-08975c72036b',
      title: 'Task4',
      description: 'Description task 4',
      status: 'completed',
      userId: '78146de0-5fbf-4008-b11c-b3875c72036b',
    },
  ];
  constructor() {}

  async findAll(): Promise<Task[]> {
    return this.tasks;
  }

  async findAllForUserId(id: string): Promise<Task[]> {
    return this.tasks.filter((task) => task.userId === id);
  }

  async findOneById(id: string): Promise<Task | null> {
    return this.tasks.find((task) => task.id === id) || null;
  }

  async create(task: Task): Promise<Task> {
    this.tasks.push(task);
    return task;
  }

  async update(task: Task): Promise<Task | null> {
    const indexToUpdate = this.tasks.findIndex((tsk) => tsk.id === task.id);
    if (indexToUpdate < 0) return null;
    this.tasks.splice(indexToUpdate, 1, task);
    return task;
  }

  async delete(task: Task): Promise<boolean> {
    const indexToUpdate = this.tasks.findIndex((tsk) => tsk.id === task.id);
    if (indexToUpdate < 0) return false;
    this.tasks.splice(indexToUpdate, 1);
    return true;
  }
}
