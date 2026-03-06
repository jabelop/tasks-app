import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/infrastructure/guards/jwt-auth.guard';
import { PermissionsGuard } from './auth/infrastructure/guards/permissions.guard';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from './libs/cache/src';
import cache from './config/cache';
import { AllExceptionsFilter } from './utils/exceptions/all-exceptions.filter';
import { TasksModule } from './tasks/tasks.module';
import { SharedTasksModule } from './shared-tasks/shared-tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, cache],
    }),
    ...(process.env.CRON_JOB === 'true' ? [ScheduleModule.forRoot()] : []),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
      serveStaticOptions: {
        redirect: false,
        index: false,
      },
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    AuthModule,
    UsersModule,
    RolesModule,
    CacheModule,
    TasksModule,
    SharedTasksModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}
