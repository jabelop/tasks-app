import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { UserNotFoundException } from '../exceptions/UserNotFoundException';
import { UserTypeOrm } from '../../../libs/shared/infrastructure/users/entity/user-typeorm.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from 'src/users/domain/repository/users.repository';

@Injectable()
export class UsersTypeOrmRepository implements UsersRepository {
  constructor(
    @InjectRepository(UserTypeOrm)
    private readonly usersRepository: Repository<UserTypeOrm>,
  ) {}

  async findAll(): Promise<UserTypeOrm[]> {
    return await this.usersRepository.find({
      relations: {
        role: true,
        subscription: true,
      },
    });
  }

  async findOneById(id: string): Promise<UserTypeOrm | null> {
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        role: true,
        subscription: true,
      },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async findByUsername(username: string): Promise<UserTypeOrm | null> {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
      relations: {
        role: true,
        subscription: true,
      },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<UserTypeOrm | null> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: {
        role: true,
        subscription: true,
      },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async create(user: UserTypeOrm): Promise<UserTypeOrm> {
    const now = new Date();

    return await this.usersRepository.save(
      this.usersRepository.create({
        id: uuid(),
        ...user,
        password: await hash(user.password),
        createdAt: now,
        updatedAt: now,
      }),
    );
  }

  async update(user: UserTypeOrm): Promise<UserTypeOrm | null> {
    const result = await this.usersRepository.update({ id: user.id }, user);

    return result.affected === 1 ? user : null;
  }

  async delete(user: UserTypeOrm): Promise<boolean> {
    const result = await this.usersRepository.delete({ id: user.id });
    return result.affected === 1;
  }
}
