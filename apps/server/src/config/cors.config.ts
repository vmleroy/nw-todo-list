import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const getCorsConfig = (): CorsOptions => {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Production origins from environment variables
  const prodOrigins = [
    process.env.FRONTEND_URL,
    // You can add multiple production URLs here
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    // Add your actual production domains
  ].filter(Boolean); // Remove undefined values

  // Allow additional origins from CORS_ORIGINS env var (comma-separated)
  if (process.env.CORS_ORIGINS) {
    prodOrigins.push(
      ...process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
    );
  }

  return {
    origin: isDevelopment ? true : prodOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'Origin',
      'Cache-Control',
      'X-CSRF-Token',
      'user',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: isDevelopment ? 0 : 86400, // Cache preflight for 24 hours in production
    preflightContinue: false,
  };
};
