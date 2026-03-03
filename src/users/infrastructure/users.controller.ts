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

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('/')
  @ApiBearerAuth()
  async index(): Promise<UserDTO[]> {
    return await this.usersService.findAll();
  }


  @Get(':id')
  @ApiBearerAuth()
  async show(@Param('id') id: string): Promise<UserDTO> {
    return await this.usersService.findOneById(id);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  async create(
    @Body() user: UserDTO,
  ): Promise<UserDTO> {
   return await this.usersService.create(user);
  }

  @Put('/')
  @UseGuards(UserPosGuard, UserUsernameGuard)
  @ApiBearerAuth()
  async update(
    @Body() user: UserDTO,
  ): Promise<UserDTO> {
    return await this.usersService.update(user);
  }

  @Delete('/')
  @HttpCode(204)
  @ApiBearerAuth()
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
