import { Inject, Injectable } from '@nestjs/common';

import { User } from '../../libs/shared/domain/users/entity/user';
import { UsersRepository } from '../domain/repository/users.repository';
import { UserDTO } from 'src/libs/shared/application/users/dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOneById(id: string): Promise<User | null> {
    return await this.usersRepository.findOneById(id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findByUsername(username);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneByEmail(email);
  }

  async create(user: User): Promise<User> {
    return this.usersRepository.create(UserDTO.validate(user));
  }

  async update(user: User): Promise<User> {
    return await this.usersRepository.update(UserDTO.validate(user));
  }

  async delete(user: User): Promise<boolean> {
    return this.usersRepository.delete(user);
  }
}
