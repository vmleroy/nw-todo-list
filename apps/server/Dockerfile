# Multi-stage build for NestJS server
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/api/package.json ./packages/api/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/jest-config/package.json ./packages/jest-config/
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
WORKDIR /app/apps/server
RUN pnpm db:generate

# Migrate database
RUN pnpm prisma migrate deploy --schema=./prisma/schema.prisma

WORKDIR /app

# Build packages first
RUN pnpm build --filter=@repo/api
RUN pnpm build --filter=@repo/typescript-config

# Build the server
RUN pnpm build --filter=server

# Production image
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs

# Install pnpm for production dependencies
RUN npm install -g pnpm

# Copy package files for production install
COPY --from=builder --chown=nestjs:nestjs /app/package.json ./package.json
COPY --from=builder --chown=nestjs:nestjs /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder --chown=nestjs:nestjs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=nestjs:nestjs /app/packages/api/package.json ./packages/api/package.json
COPY --from=builder --chown=nestjs:nestjs /app/packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY --from=builder --chown=nestjs:nestjs /app/packages/jest-config/package.json ./packages/jest-config/package.json
COPY --from=builder --chown=nestjs:nestjs /app/apps/server/package.json ./apps/server/package.json

# Install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built application and Prisma schema
COPY --from=builder --chown=nestjs:nestjs /app/apps/server/dist ./apps/server/dist
COPY --from=builder --chown=nestjs:nestjs /app/apps/server/prisma ./apps/server/prisma

# Copy the entire node_modules to include generated Prisma client
COPY --from=builder --chown=nestjs:nestjs /app/node_modules ./node_modules

# Change to server directory for execution
WORKDIR /app/apps/server

USER nestjs

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "dist/main"]
