import * as dotenv from 'dotenv';
import * as path from 'path';
import { RoleTypeOrm } from 'src/libs/shared/infrastructure/roles/entity/role-typeorm.entity';
import { UserTypeOrm } from 'src/libs/shared/infrastructure/users/entity/user-typeorm.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

dotenv.config({ path: `${__dirname}/../../../../.env` });

const config = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'tasks',
  password: process.env.DATABASE_PASS || 'secret',
  database: process.env.DATABASE_NAME || 'tasks',
  entities: [UserTypeOrm, RoleTypeOrm],
  synchronize: false,
  migrations: [path.join(__dirname, '/migrations/*.{ts,js}')],
  logging: process.env.NODE_ENV === 'dev',
  namingStrategy: new SnakeNamingStrategy(),
};

export const dataSource = new DataSource(config as DataSourceOptions);
