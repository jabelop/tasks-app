import { Reflector } from '@nestjs/core';
import {
  Injectable,
  ExecutionContext,
  Inject,
  HttpStatus,
  Logger,
  HttpException,
  CanActivate,
} from '@nestjs/common';
import {
  RateLimiterRes,
  RateLimiterAbstract,
  RateLimiterRedis,
  IRateLimiterStoreOptions,
  RLWrapperBlackAndWhite,
} from 'rate-limiter-flexible';
import { CustomRateLimiterOptions } from './custom-rate-limiter-options';
import { defaultRateLimiterOptions } from './custom-default-rate-limiter-options';
import { TokenService } from 'src/libs/token/src';
import { UserTypeOrm } from '../../shared/infrastructure/users/entity/user-typeorm.entity';
import { randomUUID } from 'crypto';
import { UsersService } from 'src/users/application/users.service';
import { CacheService } from 'src/libs/cache/src';

@Injectable()
export class CustomRateLimiterGuard implements CanActivate {
  private rateLimiters: Map<string, RateLimiterAbstract> = new Map();
  private specificOptions: CustomRateLimiterOptions;

  constructor(
    @Inject('CUSTOM_RATE_LIMITER_OPTIONS')
    private options: CustomRateLimiterOptions,
    @Inject('Reflector') private readonly reflector: Reflector,
    @Inject(TokenService) private readonly jwtService: TokenService,
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(CacheService) private readonly cacheService: CacheService,
  ) {}

  async getRateLimiter(
    options?: CustomRateLimiterOptions,
  ): Promise<RLWrapperBlackAndWhite> {
    this.options = { ...defaultRateLimiterOptions, ...this.options };
    this.specificOptions = null;
    this.specificOptions = options;

    const limiterOptions: CustomRateLimiterOptions = {
      ...this.options,
      ...options,
    };

    const { ...libraryArguments } = limiterOptions;

    let rateLimiter: RateLimiterAbstract = this.rateLimiters.get(
      libraryArguments.keyPrefix,
    );

    if (libraryArguments.execEvenlyMinDelayMs === undefined)
      libraryArguments.execEvenlyMinDelayMs =
        (this.options.duration * 1000) / this.options.points;

    if (!rateLimiter) {
      const logger = this.specificOptions?.logger || this.options.logger;

      libraryArguments.storeClient = await this.cacheService.getClient();
      rateLimiter = new RateLimiterRedis(
        libraryArguments as IRateLimiterStoreOptions,
      );
      if (logger) {
        Logger.log(
          `Rate Limiter started with ${limiterOptions.keyPrefix} key prefix`,
          'RateLimiterRedis',
        );
      }

      this.rateLimiters.set(limiterOptions.keyPrefix, rateLimiter);
    }

    rateLimiter = new RLWrapperBlackAndWhite({
      limiter: rateLimiter,
      whiteList: this.specificOptions?.whiteList || this.options.whiteList,
      blackList: this.specificOptions?.blackList || this.options.blackList,
      runActionAnyway: false,
    });

    return rateLimiter;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let points: number = this.specificOptions?.points || this.options.points;
    let pointsConsumed: number =
      this.specificOptions?.pointsConsumed || this.options.pointsConsumed;

    const reflectedOptions: CustomRateLimiterOptions =
      this.reflector.get<CustomRateLimiterOptions>(
        'rateLimit',
        context.getHandler(),
      );

    if (reflectedOptions) {
      if (reflectedOptions.points) {
        points = reflectedOptions.points;
      }

      if (reflectedOptions.pointsConsumed) {
        pointsConsumed = reflectedOptions.pointsConsumed;
      }
    }

    const request = this.httpHandler(context).req;
    const response = this.httpHandler(context).res;

    const rateLimiter: RLWrapperBlackAndWhite =
      await this.getRateLimiter(reflectedOptions);
    const user = await this.getUser(request);
    const authRoutes = ['auth/login', 'auth/signup'];

    if (
      !user?.subscription.rateLimited ||
      authRoutes.some((route) => request.route.path.includes(route))
    ) {
      pointsConsumed = 0;
    }

    const key = user?.id || request.route.path;
    await this.responseHandler(
      response,
      key,
      rateLimiter,
      points,
      pointsConsumed,
    );
    return true;
  }

  protected getIpFromRequest(request: { ip: string }): string {
    return request.ip?.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/)?.[0];
  }

  private async getUser(request): Promise<UserTypeOrm> {
    const authHeader = request.headers?.authorization;
    const token = authHeader?.split(' ')[1];
    if (token) {
      const decoded = this.jwtService.verify(token);
      const userId = decoded?.sub || decoded?.user.id || decoded.userId;

      if (userId) {
        const user = (await this.usersService.findOneById(
          userId,
        )) as UserTypeOrm;
        return user;
      } else {
        return {
          id: randomUUID(),
          name: 'anonymous',
          username: 'anonymous',
          email: 'anonymous@anon.com',
          roleId: randomUUID(),
          subscriptionId: randomUUID(),
          status: false,
          tasks: [],
          sharedTasks: [],
        };
      }
    }
  }

  private httpHandler(context: ExecutionContext) {
    if (this.options.for === 'ExpressGraphql') {
      return {
        req: context.getArgByIndex(2).req,
        res: context.getArgByIndex(2).req.res,
      };
    } else if (this.options.for === 'FastifyGraphql') {
      return {
        req: context.getArgByIndex(2).req,
        res: context.getArgByIndex(2).res,
      };
    } else {
      return {
        req: context.switchToHttp().getRequest(),
        res: context.switchToHttp().getResponse(),
      };
    }
  }

  private async setResponseHeaders(
    response: any,
    points: number,
    rateLimiterResponse: RateLimiterRes,
  ) {
    response.header(
      'Retry-After',
      Math.ceil(rateLimiterResponse.msBeforeNext / 1000),
    );
    response.header('X-RateLimit-Limit', points);
    response.header('X-Retry-Remaining', rateLimiterResponse.remainingPoints);
    response.header(
      'X-Retry-Reset',
      new Date(Date.now() + rateLimiterResponse.msBeforeNext).toUTCString(),
    );
  }

  private async responseHandler(
    response: any,
    key: any,
    rateLimiter: RateLimiterAbstract,
    points: number,
    pointsConsumed: number,
  ) {
    try {
      const rateLimiterResponse: RateLimiterRes = await rateLimiter.consume(
        key,
        pointsConsumed,
      );
      if (
        !this.specificOptions?.omitResponseHeaders &&
        !this.options.omitResponseHeaders
      )
        this.setResponseHeaders(response, points, rateLimiterResponse);
    } catch (rateLimiterResponse) {
      response.header(
        'Retry-After',
        Math.ceil(rateLimiterResponse.msBeforeNext / 1000),
      );
      if (
        typeof this.specificOptions?.customResponseSchema === 'function' ||
        typeof this.options.customResponseSchema === 'function'
      ) {
        const errorBody =
          this.specificOptions?.customResponseSchema ||
          this.options.customResponseSchema;
        throw new HttpException(
          errorBody(rateLimiterResponse),
          HttpStatus.TOO_MANY_REQUESTS,
        );
      } else {
        throw new HttpException(
          this.specificOptions?.errorMessage || this.options.errorMessage,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }
  }
}
