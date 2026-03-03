import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    cronJob: process.env.CRON_JOB || 'false',
    apiPrefix: process.env.API_PREFIX || 'api',
    apiDocsPrefix: process.env.API_DOCS_PREFIX || 'api/docs',
    jwtSecretKey: process.env.JWT_SECRET_KEY || '123456',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || 60 * 60 * 24,
    twoFAEnabled: process.env.TWO_FA_ENABLED === 'true',
    staticUrl: process.env.STATIC_URL || 'http://localhost:3000',
    forgotPasswordUrl:
      process.env.FORGOT_PASSWORD_URL || 'http://localhost:3000',
  };
});
