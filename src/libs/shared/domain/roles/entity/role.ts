export interface Role {
  id: string;
  name: string;
  status?: boolean;
  permissions: string;
  createdAt?: Date;
  updatedAt?: Date;
}
