import { Role } from 'src/libs/shared/domain/roles/entity/role';

export interface RolesRepository {
  /**
   * find all roles
   *
   * @returns {Promise<Role[]>} a promise with all roles array
   */
  find(): Promise<Role[]>;

  /**
   * find on role by id
   *
   * @param id the id to find for
   *
   * @returns {Promise<Role | null>} a promise with the role if found, with null if not
   */
  findOneById(id: string): Promise<Role | null>;

  /**
   * create a role
   *
   * @param {Role} rol the rol to be created
   *
   * @returns {Promise<Role>} a promise with the role created
   */
  create(rol: Role): Promise<Role>;

  /**
   * update a role
   *
   * @param {Role} role the role to be updated
   *
   * @returns {Promise<Role>} a promise with the role updated or null if not found
   */
  update(role: Role): Promise<Role | null>;

  /**
   * delete a role
   *
   * @param {Role} role the role to be deleted
   *
   * @returns {Promise<boolean>} a promise with true if the role was the role deleted, with false if not
   */
  delete(role: Role): Promise<boolean>;
}

export const RolesRepository = Symbol('RolesRepository');
