import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { SharedTasksService } from '../application/shared-tasks.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SharedTaskDTO } from '../application/dto/shared-task.dto';
import { SharedTaskPermissionGuard } from './guards/shared-task-permission.guard';
import { UserDTO } from '../../../src/libs/shared/application/users/dto/user.dto';
import { PermissionsGuard } from 'src/auth/decorators/permissions-guard.decorator';
import { Permissions } from 'src/libs/shared/application/permissions/permissions';

@Controller('shared-tasks')
export class SharedTasksController {
  constructor(
    private readonly sharedTasksService: SharedTasksService,
  ) { }

  @Get('/')
  @ApiBearerAuth()
  @PermissionsGuard([Permissions.SHARED_TASKS_MANAGE])
  async findAll(): Promise<SharedTaskDTO[]> {
    return await this.sharedTasksService.findAll();
  }

  @Get('/user/:id')
  @ApiBearerAuth()
  @UseGuards(SharedTaskPermissionGuard)
  async findAllForUserId(@Param('id') id: string): Promise<SharedTaskDTO[]> {
    return await this.sharedTasksService.findAllForUserId(id);
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(SharedTaskPermissionGuard)
  async create(
    @Req() request: Request & { user: UserDTO },
    @Body() sharedTask: SharedTaskDTO,
  ): Promise<SharedTaskDTO> {
    sharedTask.ownerId = request.user.id;
    return await this.sharedTasksService.create(sharedTask);
  }

  @Delete('/')
  @HttpCode(204)
  @ApiBearerAuth()
  @UseGuards(SharedTaskPermissionGuard)
  async delete(
    @Body() sharedTask: SharedTaskDTO,
  ): Promise<string> {
    return await this.sharedTasksService.delete(sharedTask)
      ? `sharedTask: ${sharedTask.taskId} deleted`
      : `error deleting sharedTask ${sharedTask.taskId}`;
  }
}
