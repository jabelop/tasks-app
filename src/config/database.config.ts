import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { RoleTypeOrm } from '../libs/shared/infrastructure/roles/entity/role-typeorm.entity';
import { UserTypeOrm } from '../libs/shared/infrastructure/users/entity/user-typeorm.entity';
import { TaskTypeOrm } from 'src/libs/shared/infrastructure/tasks/entity/task-typeorm.entity';
import { SharedTaskTypeOrm } from 'src/shared-tasks/infrastructure/entity/shared-task-typeorm.entity';

export default registerAs(
  'database',
  (): DataSourceOptions => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER || 'tasks',
    password: process.env.DATABASE_PASS || 'secret',
    database: process.env.DATABASE_NAME || 'tasks',
    entities: [RoleTypeOrm, UserTypeOrm, TaskTypeOrm, SharedTaskTypeOrm],
    synchronize: false,
    logging: process.env.DATABASE_LOG === 'true',
    namingStrategy: new SnakeNamingStrategy(),
  }),
);
