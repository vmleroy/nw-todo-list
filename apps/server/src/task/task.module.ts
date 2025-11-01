import { Module } from '@nestjs/common';
import { PrismaService } from '#/prisma.service';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { AuthModule } from '#/auth/auth.module';
import { UserModule } from '#/user/user.module';
import { RolesGuard } from '#/roles/roles.guard';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [TaskController],
  providers: [TaskService, PrismaService, RolesGuard],
  exports: [TaskService],
})
export class TaskModule {}
