import { Provider } from '@nestjs/common';
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { RateLimiterRes } from 'rate-limiter-flexible';

export interface CustomRateLimiterOptions {
  for?:
    | 'Express'
    | 'Fastify'
    | 'Microservice'
    | 'ExpressGraphql'
    | 'FastifyGraphql';
  type?: 'Memory' | 'Redis' | 'Memcache' | 'Postgres' | 'MySQL' | 'Mongo';
  keyPrefix?: string;
  points?: number;
  pointsConsumed?: number;
  inmemoryBlockDuration?: number;
  duration?: number;
  blockDuration?: number;
  inmemoryBlockOnConsumed?: number;
  queueEnabled?: boolean;
  whiteList?: string[];
  blackList?: string[];
  storeClient?: any;
  insuranceLimiter?: any;
  storeType?: string;
  dbName?: string;
  tableName?: string;
  tableCreated?: boolean;
  clearExpiredByTimeout?: boolean;
  execEvenly?: boolean;
  execEvenlyMinDelayMs?: number;
  indexKeyPrefix?: object;
  maxQueueSize?: number;
  omitResponseHeaders?: boolean;
  errorMessage?: string;
  logger?: boolean;
  customResponseSchema?: (rateLimiterResponse: RateLimiterRes) => object;
}

export interface CustomRateLimiterOptionsFactory {
  createRateLimiterOptions():
    | Promise<CustomRateLimiterOptions>
    | CustomRateLimiterOptions;
}

export interface CustomRateLimiterModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<CustomRateLimiterOptionsFactory>;
  useClass?: Type<CustomRateLimiterOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<CustomRateLimiterOptions> | CustomRateLimiterOptions;
  inject?: any[];
  extraProviders?: Provider[];
}
