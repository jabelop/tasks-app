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
  Req,
  UseGuards,
} from '@nestjs/common';

import { TasksService } from '../application/tasks.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { TaskDTO } from '../../libs/shared/application/tasks/dto/task.dto';
import { TaskPermissionGuard } from './guards/task-permission.guard';
import { PermissionsGuard } from 'src/auth/decorators/permissions-guard.decorator';
import { Permissions } from 'src/libs/shared/application/permissions/permissions';
import { UserDTO } from 'src/libs/shared/application/users/dto/user.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('/')
  @ApiBearerAuth()
  @PermissionsGuard([Permissions.TASKS_MANAGE])
  async findAll(): Promise<TaskDTO[]> {
    return await this.tasksService.findAll();
  }

  @Get('/user/:id')
  @ApiBearerAuth()
  @UseGuards(TaskPermissionGuard)
  async findAllForUserId(@Param('id') id: string): Promise<TaskDTO[]> {
    return await this.tasksService.findAllForUserId(id);
  }

  @Get(':id')
  @ApiBearerAuth()
  async findOneById(
    @Req() request: Request & { user: UserDTO },
    @Param('id') id: string,
  ): Promise<TaskDTO> {
    return await this.tasksService.findOneById(id, request.user.id);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(TaskPermissionGuard)
  async create(
    @Req() request: Request & { user: UserDTO },
    @Body() task: TaskDTO,
  ): Promise<TaskDTO> {
    task.userId = request.user.id;
    const maxTasks = (<any>request.user).subscription?.maxTasks || 0;
    return await this.tasksService.create(task, maxTasks);
  }

  @Put('/')
  @ApiBearerAuth()
  @UseGuards(TaskPermissionGuard)
  async update(@Body() task: TaskDTO): Promise<TaskDTO | null> {
    return await this.tasksService.update(task);
  }

  @Delete('/')
  @HttpCode(204)
  @ApiBearerAuth()
  @UseGuards(TaskPermissionGuard)
  async delete(@Body() task: TaskDTO): Promise<string> {
    return (await this.tasksService.delete(task))
      ? `task: ${task.id} deleted`
      : `error deleting task ${task.id}`;
  }
}
