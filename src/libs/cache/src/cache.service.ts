import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async reset(): Promise<void> {
    const keyPrefix = this.configService.get('cache.key');

    // get the store you want to iterate over.
    const store = this.cacheManager.stores.at(0);

    if (store?.iterator) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const [key, _] of store.iterator({})) {
        if (key.includes(keyPrefix)) store.delete(key);
      }
    }
  }
}
