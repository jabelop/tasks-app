import { RoleDTO } from 'src/libs/shared/application/roles/dto/role';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  roleId: string;
  role?: RoleDTO;
  status: boolean;
  subscriptionId: string;
  password?: string;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
