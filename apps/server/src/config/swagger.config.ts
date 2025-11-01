import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Todo List API')
  .setDescription(
    `
      A comprehensive Todo List API built with NestJS and Prisma.
      
      ## Features
      - User authentication with JWT tokens
      - Task management (CRUD operations)
      - User management
      - Admin functionalities
      
      ## Authentication
      Most endpoints require authentication. Use the /auth/signin endpoint to get an access token,
      then use the "Authorize" button below to set the Bearer token for protected endpoints.
      
      ## Base URL
      - Development: http://localhost:3001/api
      - Production: [Your production URL]/api
    `,
  )
  .setVersion('1.0.0')
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
    name: 'JWT',
    description: 'Enter JWT token',
    in: 'header',
  })
  .addTag('Authentication', 'Authentication related endpoints')
  .addTag('Users', 'User management endpoints')
  .addTag('Tasks', 'Task management endpoints')
  .addTag('Health Check', 'API health and status endpoints')
  .build();

export const swaggerOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true,
  },
  customSiteTitle: 'Todo List API Documentation',
  customfavIcon: '/favicon.ico',
};
