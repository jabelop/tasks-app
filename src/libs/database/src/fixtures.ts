import { hash } from 'argon2';
import { DataSource } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { RoleTypeOrm } from '../../shared/infrastructure/roles/entity/role-typeorm.entity';
import { UserTypeOrm as User } from '../../shared/infrastructure/users/entity/user-typeorm.entity';
import { dataSource } from './datasource';
import { Permissions } from 'src/libs/shared/application/permissions/permissions';
console.info('Running fixtures...');

class LoadFixtures {
  connection: DataSource;

  async getDataSource(): Promise<DataSource> {
    if (!this.connection) {
      this.connection = await dataSource.initialize();
    }

    return this.connection;
  }

  async run(): Promise<void> {
    const { admin, user } = await this.createRoles();
    await this.createUsers({ adminRole: admin, userRole: user });
  }

  async createRoles(): Promise<{ admin: RoleTypeOrm; user: RoleTypeOrm }> {
    const roleRepository = (await this.getDataSource()).getRepository(RoleTypeOrm);
    await roleRepository.delete({});

    const adminRole: RoleTypeOrm = await this.createRole('Admin', [
      Permissions.ROLES_VIEW,
      Permissions.ROLES_MANAGE
    ]);

    const userRole: RoleTypeOrm = await this.createRole('user', []);

    return {
      admin: adminRole,
      user: userRole,
    };
  }

  async createRole(name: string, permissions: Permissions[]): Promise<RoleTypeOrm> {
    const role = new RoleTypeOrm();

    role.id = uuid();
    role.name = name;
    role.status = true;
    role.permissions = JSON.stringify((<unknown>permissions) as string[]);
    role.createdAt = new Date();
    role.updatedAt = new Date();

    const roleRepository = (await this.getDataSource()).getRepository(RoleTypeOrm);
    await roleRepository.save(role);

    return role;
  }

  async createUsers(roles: {
    adminRole: RoleTypeOrm;
    userRole: RoleTypeOrm;
  }): Promise<void> {
    // Admin user creation
    const admin = new User();

    admin.id = uuid();
    admin.name = 'Admin';
    admin.username = 'admin';
    admin.password = await hash('secret');
    admin.roleId = roles.adminRole.id;
    admin.email = 'admin@tasks.test';
    admin.status = true;
    admin.createdAt = new Date();
    admin.updatedAt = new Date();

    // regular user creation
    const user = new User();

    user.id = uuid();
    user.name = 'User';
    user.username = 'user';
    user.password = await hash('secret');
    user.roleId = roles.userRole.id;
    user.email = 'user@tasks.test';
    user.status = true;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    const userRepository = (await this.getDataSource()).getRepository(User);
    await userRepository.delete({});
    await userRepository.save([admin, user]);
  }
}

const fixtures = new LoadFixtures();

fixtures
  .run()
  .then(() => {
    console.info('Done');

    process.exit(0);
  })
  .catch((err: any) => {
    console.error('Error');
    console.error(err);

    process.exit(1);
  });
