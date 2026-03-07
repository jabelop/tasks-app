import { Injectable } from '@nestjs/common';

import { RolesRepository } from '../../../src/roles/domain/repository/roles.repository';
import { Role } from '../../../src/libs/shared/domain/roles/entity/role';

@Injectable()
export class RolesTestRepository implements RolesRepository {
  roles: Role[] = [
    {
      id: '78146de0-5fbf-40f8-b11c-08975c72036e',
      name: 'Role1',
      permissions: '[permission1]',
      status: true,
    },
    {
      id: '70146de0-5fbf-40f8-b11c-08975c72036b',
      name: 'Role1',
      permissions: '[permission1]',
      status: true,
    },
  ];
  constructor() {}

  async find(): Promise<Role[]> {
    return this.roles;
  }

  async findOneById(id: string): Promise<Role | null> {
    return this.roles.find((role) => role.id === id) || null;
  }

  async create(rol: Role): Promise<Role> {
    this.roles.push(rol);
    return rol;
  }

  async update(role: Role): Promise<Role | null> {
    const indexToUpdate = this.roles.findIndex((r) => r.id === role.id);
    if (indexToUpdate < 0) return null;

    this.roles.splice(indexToUpdate, 1, role);
    return role;
  }

  async delete(role: Role): Promise<boolean> {
    const indexToUpdate = this.roles.findIndex((r) => r.id === role.id);
    if (indexToUpdate < 0) return false;
    this.roles.splice(indexToUpdate, 1);
    return true;
  }
}
