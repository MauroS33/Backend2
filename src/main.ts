import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API para un sistema de e-commerce')
    .setVersion('1.0')
    .addTag('users', 'Endpoints relacionados con usuarios')
    .addTag('products', 'Endpoints relacionados con productos')
    .addTag('cart', 'Endpoints relacionados con el carrito')
    .addBearerAuth() // Para autenticación JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Ruta para acceder a Swagger

  await app.listen(3000);
}
bootstrap();