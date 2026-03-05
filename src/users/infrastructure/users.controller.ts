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
  Request,
  UseGuards,
} from '@nestjs/common';

import { UserPosGuard } from './guards/user-pos.guard';
import { UserUsernameGuard } from './guards/user-username.guard';
import { UsersService } from '../application/users.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserDTO } from '../../libs/shared/application/users/dto/user.dto';
import { Permissions } from 'src/libs/shared/application/permissions/permissions';
import { PermissionsGuard } from 'src/auth/decorators/permissions-guard.decorator';
import { UserPermissionGuard } from './guards/user-permission.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('/')
  @PermissionsGuard([Permissions.USERS_MANAGE])
  @ApiBearerAuth()
  async findAll(): Promise<UserDTO[]> {
    return await this.usersService.findAll();
  }


  @Get(':id')
  @ApiBearerAuth()
  async findOneById(@Param('id') id: string): Promise<UserDTO> {
    return await this.usersService.findOneById(id);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(UserPosGuard, UserUsernameGuard, UserPermissionGuard)
  async create(
    @Body() user: UserDTO,
  ): Promise<UserDTO> {
   return await this.usersService.create(user);
  }

  @Put('/')
  @UseGuards(UserPosGuard, UserUsernameGuard, UserPermissionGuard)
  @ApiBearerAuth()
  async update(
    @Body() user: UserDTO,
  ): Promise<UserDTO> {
    return await this.usersService.update(user);
  }

  @Delete('/')
  @HttpCode(204)
  @ApiBearerAuth()
  @UseGuards(UserPermissionGuard)
  async delete(
    @Request() request: Request & { user: UserDTO },
    @Param('id') user: UserDTO,
  ): Promise<string> {
    request.user;
    return await this.usersService.delete(user)
      ? `user: ${user.id} deleted`
      : `error deleting user ${user.id}`;
  }
}
