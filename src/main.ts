
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSecurity } from './security';
import { setupSwagger } from './swagger';
import * as express from 'express'
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json({ limit: '50mb' }))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: 422,
    }),
  )

  app.useGlobalFilters(new AllExceptionsFilter())

  setupSecurity(app)

  setupSwagger(app)

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
