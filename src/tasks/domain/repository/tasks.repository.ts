import { Task } from "../../../libs/shared/domain/tasks/entity/task";

export interface TasksRepository {

  /**
   * find all tasks
   * 
   * @returns {Promise<Task[]>} a promise with all task array
   */
  findAll(): Promise<Task[]>;

  /**
   * find all user tasks by their id
   * 
   * @returns {Promise<Task[]>} a promise with all user tasks array
   */
  findAllForUserId(id: string): Promise<Task[]>;

  /**
   * find one task by id
   * 
   * @param id the id to find the task for
   * @param userId the user logged in
   * 
   * @returns {Promise<Task | null>} a promise with the task if found, with null if not
   */
  findOneById(id: string, userId: string): Promise<Task | null>;

  /**
   * create a task
   * 
   * @param {Task} task the task to be created
   * 
   * @returns {Promise<Task>} a promise with the task created
   */
  create(task: Task): Promise<Task>;

  /**
   * update a task
   * 
   * @param {Task} task the task to be updated 
   * 
   * @returns {Promise<Task>} a promise with the task updated or null if not found
   */
  update(task: Task): Promise<Task | null>;

  /**
   * delete a task
   * 
   * @param {Task} task the task to be deleted 
   * 
   * @returns {Promise<boolean>} a promise with true if the task was deleted, with false if not
   */
  delete(task: Task): Promise<boolean>;
}

export const TasksRepository = Symbol('TasksRepository');
