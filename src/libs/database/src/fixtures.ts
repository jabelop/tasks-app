import { hash } from 'argon2';
import { DataSource } from 'typeorm';

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
    await roleRepository.createQueryBuilder().delete();

    const adminRole: RoleTypeOrm = await this.createRole(
      'Admin',
      '06c2f397-def1-3336-a0a9-476b482b82eb',
      [
        Permissions.ROLES_VIEW,
        Permissions.ROLES_MANAGE,
        Permissions.TASKS_MANAGE,
        Permissions.USERS_MANAGE
      ]
    );

    const userRole: RoleTypeOrm = await this.createRole(
      'user',
      '06c2f397-def1-2226-a0a9-476b482b82eb',
      []
    );

    return {
      admin: adminRole,
      user: userRole,
    };
  }

  async createRole(name: string, id: string, permissions: Permissions[]): Promise<RoleTypeOrm> {
    const role = new RoleTypeOrm();

    role.id = id;
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

    admin.id = '78146de0-5fbf-40f8-b11c-08975c7204da';
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

    user.id = '06c2f397-def1-4ef6-a0a9-476b482b82eb';
    user.name = 'User';
    user.username = 'user';
    user.password = await hash('secret');
    user.roleId = roles.userRole.id;
    user.email = 'user@tasks.test';
    user.status = true;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    const userRepository = (await this.getDataSource()).getRepository(User);
    await userRepository.createQueryBuilder().delete();
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
