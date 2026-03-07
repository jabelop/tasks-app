import { MiddlewareConsumer, Module } from '@nestjs/common';
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
import { LoggerMiddleware } from './libs/shared/infrastructure/middlewares/logger.middleware';
import { CustomRateLimiterModule } from './libs/rate-limiter/custom-rate-limiter.module';
import { CustomRateLimiterGuard } from './libs/rate-limiter/infrastructure/custom-rate-limiter.guard';
import { TokenModule } from './libs/token/src';

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
    TokenModule,
    AuthModule,
    UsersModule,
    RolesModule,
    CacheModule,
    TasksModule,
    SharedTasksModule,
    CustomRateLimiterModule.register({
      duration: 60,
      points: 6,
    }),
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
    {
      provide: APP_GUARD,
      useClass: CustomRateLimiterGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // Apply to all routes
  }
}
