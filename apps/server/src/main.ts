import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Set global API prefix
  app.setGlobalPrefix('api');
  
  // Configure CORS for development
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow both frontend ports
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  await app.listen(3001); // Changed to port 3001 to avoid conflicts
}

void bootstrap();
