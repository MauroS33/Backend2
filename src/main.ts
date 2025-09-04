import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from './sentry.interceptor';

Sentry.init({
  dsn: 'https://',  //Agregar direccion de sentry
  tracesSampleRate: 1.0,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new SentryInterceptor()); // Captura errores globales
  await app.listen(3000);
}
bootstrap();