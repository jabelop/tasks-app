import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(`/${configService.get<string>('app.apiPrefix')}`);
  app.use(helmet());
  app.set('query parser', 'extended');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Tasks')
    .setDescription('The Tasks API description')
    .setVersion('1.0')
    .addTag('Tasks')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory, {
    customSiteTitle: 'API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  if (
    configService.getOrThrow<string>('app.cronJob') === 'true' &&
    configService.getOrThrow<string>('app.nodeEnv') !== 'development'
  ) {
    console.log('=== APP MODE CRON ===');
    await app.init();
  } else {
    console.log('=== APP MODE API ===');
    await app.listen(configService.getOrThrow<number>('app.port'));
  }
}
bootstrap();
