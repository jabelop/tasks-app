import { User } from 'src/libs/shared/domain/users/entity/user';

export interface UsersRepository {
  findAll(): Promise<User[]>;

  findOneById(id: string): Promise<User | null>;

  findByUsername(username: string): Promise<User | null>;

  findOneByEmail(email: string): Promise<User | null>;

  create(user: User): Promise<User>;

  update(user: User): Promise<User | null>;

  delete(user: User): Promise<boolean>;
}

export const UsersRepository = Symbol('UsersRepository');
