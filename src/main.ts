import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import {
  GlobalExceptionFilter,
  TransformResponseInterceptor,
} from './utils/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //global filters
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  const port = process.env.PORT ?? 6000;
  await app.listen(port);
  console.log('Server is running on port:', port);
}

bootstrap();
