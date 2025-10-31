import { Module } from '@nestjs/common';
import { PrismaService } from '#/prisma.service';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { AuthModule } from '#/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TaskController],
  providers: [TaskService, PrismaService],
  exports: [TaskService],
})
export class TaskModule {}
