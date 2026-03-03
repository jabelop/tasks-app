import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { PermissionsGuard } from '../../auth/decorators/permissions-guard.decorator';
import { RolesService } from '../application/roles.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleDTO } from '../../libs/shared/application/roles/dto/role';
import { Permissions } from 'src/libs/shared/application/permissions/permissions';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('/')
  @PermissionsGuard([Permissions.ROLES_VIEW])
  @ApiBearerAuth()
  async index(): Promise<RoleDTO[]> {
    return await this.rolesService.find();
  }

  @Get(':id')
  @PermissionsGuard([Permissions.ROLES_VIEW])
  @ApiBearerAuth()
  async show(@Param('id') id: string): Promise<RoleDTO> {
    return await this.rolesService.findOneById(id);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @PermissionsGuard([Permissions.ROLES_MANAGE])
  @ApiBearerAuth()
  async create(@Body() params: RoleDTO): Promise<RoleDTO> {
    return await this.rolesService.create(params);

  }

  @Put('/')
  @PermissionsGuard([Permissions.ROLES_MANAGE])
  @ApiBearerAuth()
  async update(
    @Body() params: RoleDTO,
  ): Promise<RoleDTO> {
    return await this.rolesService.update(params);
  }

  @Delete('/')
  @HttpCode(204)
  @PermissionsGuard([Permissions.ROLES_MANAGE])
  @ApiBearerAuth()
  async delete(
    @Body() params: RoleDTO,
): Promise<void> {
    await this.rolesService.delete(params);
  }
}
