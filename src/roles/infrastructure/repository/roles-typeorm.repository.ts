import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { RolesRepository } from 'src/roles/domain/repository/roles.repository';
import { RoleTypeOrm } from '../../../libs/shared/infrastructure/roles/entity/role-typeorm.entity';

@Injectable()
export class RolesTypeOrmRepository implements RolesRepository {
  constructor(
    @InjectRepository(RoleTypeOrm)
    private rolesRepository: Repository<RoleTypeOrm>,
  ) {}


  async find(): Promise<RoleTypeOrm[]> {
    return await this.rolesRepository.find();
  }

  async findOneById(id: string): Promise<RoleTypeOrm | null> {
    const role = await this.rolesRepository.findOneBy({
      id: id,
    });

    if (!role) {
      throw new NotFoundException();
    }

    return role;
  }

  async create(role: RoleTypeOrm): Promise<RoleTypeOrm> {
    const now = new Date();

    return await this.rolesRepository.save(
      this.rolesRepository.create({
        id: uuid(),
        ...role,
        createdAt: now,
        updatedAt: now,
      }),
    );
  }

  async update(role: RoleTypeOrm): Promise<RoleTypeOrm> {
    const result = await this.rolesRepository.update({ id: role.id }, role);
    return result.affected === 1 ? role : null;
  }

  async delete(role: RoleTypeOrm): Promise<boolean> {
    return (await this.rolesRepository.delete({ id: role.id })).affected === 1;
  }
}
