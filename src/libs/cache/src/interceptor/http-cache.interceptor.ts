import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import {
  CACHE_MANAGER,
  CacheInterceptor as NestCacheInterceptor,
} from '@nestjs/cache-manager';

@Injectable()
export class HttpCacheInterceptor extends NestCacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER)
    cacheManager: any,
    @Inject(Reflector)
    reflector: any,
    private configService: ConfigService,
  ) {
    super(cacheManager, reflector);
  }

  trackBy(context: ExecutionContext): string | undefined {
    const route = super.trackBy(context);

    if (!this.configService.get('cache.enabled')) {
      return undefined;
    }

    return route
      ? `${this.configService.get('cache.key')}-${route}`
      : undefined;
  }
}
