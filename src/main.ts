import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import {
  GlobalExceptionFilter,
  TransformResponseInterceptor,
} from './utils/interceptors';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  //global filters
  app.setGlobalPrefix('/api');
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  const port = process.env.PORT ?? 6000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log('Server is running on port:', port);
}

// eslint-disable-next-line no-console
bootstrap().catch(console.error);
