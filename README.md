# NW Todo List

A full-stack todo list application built with modern technologies including NestJS, Next.js, and deployed on AWS.

## 🏗️ Architecture

This is a monorepo managed with Turborepo containing:

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: NestJS API with Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Infrastructure**: AWS (ECS, RDS, ECR)
- **Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
.
├── apps/
│   ├── server/          # NestJS API server
│   └── web/            # Next.js frontend
├── packages/
│   ├── api/            # Shared API types and DTOs
│   ├── ui/             # Shared React components
│   ├── eslint-config/  # ESLint configurations
│   ├── typescript-config/ # TypeScript configurations
│   ├── tailwind-config/   # Tailwind CSS config
│   ├── jest-config/       # Jest test config
│   └── infra/             # Terraform infrastructure
└── docs/               # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database
- Docker (for deployment)

### 1. Clone and Install

```bash
git clone <repository-url>
cd nw-todo-list
pnpm install
```

### 2. Environment Setup

Create environment files:

- You need to have a postgreSQL instance running (I recommend using Neon). You will only need to have the database url connection

**apps/server/.env**

```env
DATABASE_URL="postgresql://username:password@localhost:5432/todolist"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="development"
PORT=3001
CORS_ORIGINS="http://localhost:3000"
FRONTEND_URL="http://localhost:3000"
```

**apps/web/.env.local**

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

### 3. Database Setup

```bash
# Navigate to server directory
cd apps/server

# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# (Optional) Seed database
pnpm db:seed
```

### 4. Start Development

```bash
# From root directory - starts both frontend and backend
pnpm dev

# Or start individually:
# Backend only
cd apps/server && pnpm dev

# Frontend only
cd apps/web && pnpm dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **API Documentation**: http://localhost:3001/api-docs

## 📚 Features

### Authentication

- User registration and login
- JWT token-based authentication
- Role-based access control (USER/ADMIN)

### Task Management

- Create, read, update, delete tasks
- Task completion tracking

### Admin Features

- View all tasks from all users
- User attribution (shows who created each task)

## 🛠️ Development Commands

```bash
# Install dependencies
pnpm install

# Development (all apps)
pnpm dev

# Build all packages and apps
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format

# Database operations (from apps/server)
pnpm db:generate    # Generate Prisma client
pnpm db:migrate     # Run migrations
pnpm db:seed        # Seed database
pnpm db:studio      # Open Prisma Studio
pnpm db:reset       # Reset database
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run tests for specific package
pnpm test --filter=server
```

## 📖 API Documentation

The API is fully documented with Swagger/OpenAPI:

1. Start the server: `cd apps/server && pnpm dev`
2. Visit: http://localhost:3001/api-docs
3. Use the "Authorize" button to test authenticated endpoints

### Key Endpoints

- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/tasks/admin/all` - Get all tasks (admin only)

## 🚀 Deployment

### Docker Deployment

Build images:

```bash
# Build server image
docker build -t nw-todo-server -f apps/server/Dockerfile .

# Build web image
docker build -t nw-todo-web -f apps/web/Dockerfile .
```

### AWS Deployment

The project includes Terraform configurations for AWS deployment:

1. **Prerequisites**:
   - AWS CLI configured
   - Terraform installed
   - Docker installed

2. **Deploy Infrastructure**:

   ```bash
   cd packages/infra/terraform/aws

   # Initialize Terraform
   terraform init

   # Plan deployment
   terraform plan -var="db_password=your-secure-password"

   # Apply infrastructure
   terraform apply -var="db_password=your-secure-password"
   ```

3. **Build and Push Images**:

   ```bash
   # Get ECR login token
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-ecr-url>

   # Build and push images
   docker build -t <ecr-web-url>:latest -f apps/web/Dockerfile .
   docker push <ecr-web-url>:latest

   docker build -t <ecr-server-url>:latest -f apps/server/Dockerfile .
   docker push <ecr-server-url>:latest
   ```

- This output will be thrown after running terraform, so you can have the correct commands.

## 🔧 Configuration

### Database

The application uses PostgreSQL with Prisma ORM. Schema is defined in [`apps/server/prisma/schema.prisma`](apps/server/prisma/schema.prisma).

### CORS

CORS configuration is in [`apps/server/src/config/cors.config.ts`](apps/server/src/config/cors.config.ts). In development, it allows all origins. In production, configure specific domains.

### Validation

All API inputs are validated using class-validator decorators in DTOs located in [`packages/api/src/`](packages/api/src/).

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Issues**:
   - Verify PostgreSQL is running
   - Check DATABASE_URL format
   - Ensure database exists

2. **CORS Errors**:
   - Check CORS_ORIGINS environment variable
   - Verify frontend URL is allowed

3. **Build Failures**:
   - Build packages first: `pnpm build --filter=@repo/*`
   - Clear node_modules and reinstall

4. **Authentication Issues**:
   - Check JWT_SECRET is set
   - Verify token format in requests

### Logs

- **Development**: Check terminal output
- **Production**: Use AWS CloudWatch logs

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Useful Links

- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Turborepo Documentation](https://turborepo.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
