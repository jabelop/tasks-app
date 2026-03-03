import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';

import { CacheService } from './cache.service';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: false,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          ttl: config.get<number>('cache.ttlMinutes') * 60000,
          stores: [
            new KeyvRedis(
              `redis://${config.get<string>('cache.host')}:${config.get<string>('cache.port')}`,
            ),
          ],
          socket: {
            host: config.get<string>('cache.host'),
            port: config.get<number>('cache.port'),
          },
          pingInterval: 1000,
          password: config.get<string | null>('cache.password'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [NestCacheModule, CacheService],
})
export class CacheModule {}
