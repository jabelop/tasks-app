import { SetMetadata } from '@nestjs/common';
import { CustomRateLimiterOptions } from './custom-rate-limiter-options';

export const CustomRateLimiter = (
  options: CustomRateLimiterOptions,
): MethodDecorator => SetMetadata('rateLimit', options);
