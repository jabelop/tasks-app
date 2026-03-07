import { hash } from 'argon2';
import { DataSource } from 'typeorm';

import { RoleTypeOrm } from '../../shared/infrastructure/roles/entity/role-typeorm.entity';
import { UserTypeOrm as User } from '../../shared/infrastructure/users/entity/user-typeorm.entity';
import { dataSource } from './datasource';
import { Permissions } from 'src/libs/shared/application/permissions/permissions';
import { SubscriptionTypeOrm } from 'src/libs/shared/infrastructure/subscriptions/subscription-typeorm.entity';
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
    const { free, premium } = await this.createSubscriptions();
    await this.createUsers({
      adminRole: admin,
      userRole: user,
      freeSubscription: free,
      premiumSubscription: premium,
    });
  }

  async createRoles(): Promise<{ admin: RoleTypeOrm; user: RoleTypeOrm }> {
    const roleRepository = (await this.getDataSource()).getRepository(
      RoleTypeOrm,
    );
    await roleRepository.createQueryBuilder().delete();

    const adminRole: RoleTypeOrm = await this.createRole(
      'Admin',
      '06c2f397-def1-3336-a0a9-476b482b82eb',
      [
        Permissions.ROLES_VIEW,
        Permissions.ROLES_MANAGE,
        Permissions.TASKS_MANAGE,
        Permissions.USERS_MANAGE,
        Permissions.SHARED_TASKS_MANAGE,
      ],
    );

    const userRole: RoleTypeOrm = await this.createRole(
      'user',
      '06c2f397-def1-2226-a0a9-476b482b82eb',
      [],
    );

    return {
      admin: adminRole,
      user: userRole,
    };
  }

  async createRole(
    name: string,
    id: string,
    permissions: Permissions[],
  ): Promise<RoleTypeOrm> {
    const role = new RoleTypeOrm();

    role.id = id;
    role.name = name;
    role.status = true;
    role.permissions = JSON.stringify((<unknown>permissions) as string[]);
    role.createdAt = new Date();
    role.updatedAt = new Date();

    const roleRepository = (await this.getDataSource()).getRepository(
      RoleTypeOrm,
    );
    await roleRepository.save(role);

    return role;
  }

  async createSubscriptions(): Promise<{
    free: SubscriptionTypeOrm;
    premium: SubscriptionTypeOrm;
  }> {
    const subscriptionsRepository = (await this.getDataSource()).getRepository(
      SubscriptionTypeOrm,
    );
    await subscriptionsRepository.createQueryBuilder().delete();

    const free: SubscriptionTypeOrm = await this.createSubscription({
      id: '06c2f397-def1-3336-a0a9-476b482b82eb',
      name: 'Free',
      description: 'Free subscription',
      price: 0,
      maxTasks: 100,
      rateLimited: true,
    });

    const premium: SubscriptionTypeOrm = await this.createSubscription({
      id: '06c2f397-def1-3336-a0a9-476b482b80eb',
      name: 'Premium',
      description: 'Premium subscription',
      price: 100,
      maxTasks: 100000,
      rateLimited: false,
    });

    return {
      free,
      premium,
    };
  }

  async createSubscription({
    id,
    name,
    description,
    price,
    maxTasks,
    rateLimited,
  }): Promise<SubscriptionTypeOrm> {
    const subscription = new SubscriptionTypeOrm();

    subscription.id = id;
    subscription.name = name;
    subscription.price = price;
    subscription.maxTasks = maxTasks;
    subscription.rateLimited = rateLimited;
    subscription.description = description;
    subscription.createdAt = new Date();
    subscription.updatedAt = new Date();

    const subscriptionRepository = (await this.getDataSource()).getRepository(
      SubscriptionTypeOrm,
    );
    await subscriptionRepository.save(subscription);

    return subscription;
  }

  async createUsers(options: {
    adminRole: RoleTypeOrm;
    userRole: RoleTypeOrm;
    freeSubscription: SubscriptionTypeOrm;
    premiumSubscription: SubscriptionTypeOrm;
  }): Promise<void> {
    // Admin user creation
    const admin = new User();

    admin.id = '78146de0-5fbf-40f8-b11c-08975c7204da';
    admin.name = 'Admin';
    admin.username = 'admin';
    admin.password = await hash('secret');
    admin.roleId = options.adminRole.id;
    admin.email = 'admin@tasks.test';
    admin.status = true;
    admin.subscriptionId = options.premiumSubscription.id;
    admin.createdAt = new Date();
    admin.updatedAt = new Date();

    // regular user creation
    const user = new User();

    user.id = '06c2f397-def1-4ef6-a0a9-476b482b82eb';
    user.name = 'User';
    user.username = 'user';
    user.password = await hash('secret');
    user.roleId = options.userRole.id;
    user.email = 'user@tasks.test';
    user.status = true;
    user.subscriptionId = options.freeSubscription.id;
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
