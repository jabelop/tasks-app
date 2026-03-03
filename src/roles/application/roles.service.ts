import { Inject, Injectable } from '@nestjs/common';

import { RolesRepository } from '../domain/repository/roles.repository';
import { RoleDTO } from '../../libs/shared/application/roles/dto/role';

@Injectable()
export class RolesService {
  constructor(
    @Inject(RolesRepository)
    private rolesRepository: RolesRepository,
  ) {}

  async find(): Promise<RoleDTO[]> {
    return await this.rolesRepository.find();
  }


  async findOneById(id: string): Promise<RoleDTO | null> {
    return await this.rolesRepository.findOneById(id);
  }

  async create(role: RoleDTO): Promise<RoleDTO> {
    return await this.rolesRepository.create(RoleDTO.validate(role));
  }

  async update(role: RoleDTO): Promise<RoleDTO> {
    return await this.rolesRepository.update(RoleDTO.validate(role));
  }

  async delete(role: RoleDTO): Promise<boolean> {
    return await this.rolesRepository.delete(RoleDTO.validate(role));
  }
}
