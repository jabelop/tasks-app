import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from '../roles/roles.module';
import { AuthController } from './infrastructure/auth.controller';
import { AuthService } from './application/auth.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { HashModule } from '../libs/hash/src';
import { TokenModule } from 'src/libs/token/src';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrm } from 'src/libs/shared/infrastructure/users/entity/user-typeorm.entity';
import { AuthRepository } from './domain/repository/auth.repository';
import { AuthTypeOrmRepository } from './infrastructure/repository/auth-typeorm.repository';

const authRepositoryProvider = {
  provide: AuthRepository,
  useClass: AuthTypeOrmRepository
}

@Module({
  imports: [
    UsersModule,
    RolesModule,
    PassportModule,
    HashModule,
    TokenModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwtSecretKey'),
        signOptions: {
          expiresIn: `${configService.get<string>('app.jwtExpiresIn')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserTypeOrm])
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    LocalStrategy, 
    JwtStrategy,
    authRepositoryProvider,
  ],
})
export class AuthModule {}
