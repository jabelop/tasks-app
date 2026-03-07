import { Module, DynamicModule, Provider } from '@nestjs/common';
import { defaultRateLimiterOptions } from './infrastructure/custom-default-rate-limiter-options';
import {
  CustomRateLimiterModuleAsyncOptions,
  CustomRateLimiterOptions,
  CustomRateLimiterOptionsFactory,
} from './infrastructure/custom-rate-limiter-options';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeOrm } from '../shared/infrastructure/users/entity/user-typeorm.entity';
import { CacheModule } from '../cache/src/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrm]), CacheModule],
  exports: ['CUSTOM_RATE_LIMITER_OPTIONS'],
  providers: [
    {
      provide: 'CUSTOM_RATE_LIMITER_OPTIONS',
      useValue: defaultRateLimiterOptions,
    },
  ],
})
export class CustomRateLimiterModule {
  static register(
    options: CustomRateLimiterOptions = defaultRateLimiterOptions,
  ): DynamicModule {
    return {
      module: CustomRateLimiterModule,
      providers: [
        { provide: 'CUSTOM_RATE_LIMITER_OPTIONS', useValue: options },
      ],
    };
  }

  static registerAsync(
    options: CustomRateLimiterModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: CustomRateLimiterModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        ...(options.extraProviders || []),
      ],
    };
  }

  private static createAsyncProviders(
    options: CustomRateLimiterModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: CustomRateLimiterModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: 'CUSTOM_RATE_LIMITER_OPTIONS',
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: 'CUSTOM_RATE_LIMITER_OPTIONS',
      useFactory: async (optionsFactory: CustomRateLimiterOptionsFactory) =>
        optionsFactory.createRateLimiterOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
