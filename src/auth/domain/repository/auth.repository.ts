import { User } from 'src/libs/shared/domain/users/entity/user';
import { LoginSuccess } from '../entities/login-success';

export interface AuthRepository {
  /**
   * login an user with given username and password
   *
   * @param {string} username the user's username
   * @param {string} password the user's password
   *
   * @returns {Promise<LoginSuccess>} the promise with the result of the login process with user's info and JWT token
   */
  login(username: string, password: string): Promise<LoginSuccess>;

  /**
   * signup a given user
   *
   * @param {User} user the user to be signedup
   *
   * @returns {User} The user signedup promise
   */
  signup(username: User): Promise<User>;

  /**
   * refresh a token for a given user
   *
   * @param {User} user the user to refresh the token for
   *
   * @returns {Promise<LoginSuccess>} the promise with the result of the login process with user's info and JWT token
   */
  refreshToken(user: User): Promise<LoginSuccess>;
}

export const AuthRepository = Symbol('AuthRepository');
