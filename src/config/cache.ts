import { registerAs } from '@nestjs/config';

export interface CacheConfig {
  enabled: boolean;
  host: string;
  port: number;
  key: string;
  password: string | null;
  ttlMinutes: number;
}

export default registerAs(
  'cache',
  (): CacheConfig => ({
    enabled: process.env.CACHE_ENABLED === 'true',
    host: process.env.CACHE_HOST || 'localhost',
    port: Number.parseInt(process.env.CACHE_PORT) || 6379,
    key: process.env.CACHE_KEY || 'tasks-backend',
    password: process.env.CACHE_PASSWORD || null,
    ttlMinutes: Number.parseInt(process.env.CACHE_TTL_MINUTES) || 15,
  }),
);
