import { SharedTask } from '../entity/shared-task';

export interface SharedTasksRepository {
  /**
   * find all tasks
   *
   * @returns {Promise<SharedTask[]>} a promise with all shared tasks array
   */
  findAll(): Promise<SharedTask[]>;

  /**
   * find all user shared tasks by their id
   *
   * @returns {Promise<SharedTask[]>} a promise with all user shared tasks array
   */
  findAllForUserId(id: string): Promise<SharedTask[]>;

  /**
   * create a shared task
   *
   * @param {SharedTask} task the shared task to be created
   *
   * @returns {Promise<SharedTask>} a promise with the shared task created
   */
  create(task: SharedTask): Promise<SharedTask>;

  /**
   * delete a shared task
   *
   * @param {SharedTask} task the shared to be deleted
   *
   * @returns {Promise<boolean>} a promise with true if the shared task was deleted, with false if not
   */
  delete(task: SharedTask): Promise<boolean>;
}

export const SharedTasksRepository = Symbol('SharedTasksRepository');
