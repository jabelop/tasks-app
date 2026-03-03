import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleTypeOrm } from '../libs/shared/infrastructure/roles/entity/role-typeorm.entity';
import { RolesController } from './infrastructure/roles.controller';
import { RolesService } from './application/roles.service';
import { RolesRepository } from './domain/repository/roles.repository';
import { RolesTypeOrmRepository } from './infrastructure/repository/roles-typeorm.repository';

const rolesRepositoryProvider = {
  provide: RolesRepository,
  useClass: RolesTypeOrmRepository
};

@Module({
  imports: [TypeOrmModule.forFeature([RoleTypeOrm])],
  controllers: [RolesController],
  providers: [RolesService, rolesRepositoryProvider],
  exports: [RolesService],
})
export class RolesModule {}
