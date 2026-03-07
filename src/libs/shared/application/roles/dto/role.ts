import { Role } from 'src/libs/shared/domain/roles/entity/role';
import { Name } from 'src/libs/shared/domain/value-objects/users/name';
import UuidV4 from 'src/libs/shared/domain/value-objects/uuid-v4';

export class RoleDTO implements Role {
  id: string;
  name: string;
  status?: boolean;
  permissions: string;
  createdAt?: Date;
  updatedAt?: Date;

  static validate(role: RoleDTO): RoleDTO {
    const validatedRole: RoleDTO = new RoleDTO();

    validatedRole.id = new UuidV4(role.id).getValue();
    validatedRole.name = new Name(role.name).getValue();
    validatedRole.permissions = role.permissions;
    validatedRole.status = role.status;
    validatedRole.createdAt = role.createdAt;
    validatedRole.updatedAt = role.updatedAt;

    return validatedRole;
  }
}
