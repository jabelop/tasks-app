import UuidV4 from 'src/libs/shared/domain/value-objects/uuid-v4';
import { User } from '../../../domain/users/entity/user'
import { RoleDTO } from '../../roles/dto/role';
import { UserName } from 'src/libs/shared/domain/value-objects/username';
import { Name } from 'src/libs/shared/domain/value-objects/name';
import { Email } from 'src/libs/shared/domain/value-objects/email';
import { Password } from 'src/libs/shared/domain/value-objects/password';

export class UserDTO implements User {
  id: string;
  name: string;
  username: string;
  email: string;
  roleId: string;
  role?: RoleDTO;
  status: boolean;
  password?: string;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;

  static validate(user: UserDTO): UserDTO {
    const validatedUser: UserDTO = new UserDTO();

    validatedUser.id = new UuidV4(user.id).getValue();
    validatedUser.name = new Name(user.name).getValue();
    validatedUser.username = new UserName(user.username).getValue();
    validatedUser.email = new Email(user.email).getValue();
    validatedUser.roleId = user.roleId;
    validatedUser.role = user.role;
    validatedUser.status = user.status;
    validatedUser.password = new Password(user.password).getValue();
    validatedUser.lastLogin = user.lastLogin;
    validatedUser.createdAt = user.createdAt;
    validatedUser.updatedAt = user.updatedAt;

    return validatedUser;
  }
}
