import { Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { AppController } from './app.controller';

@Module({
  imports: [AuthModule, UserModule, TaskModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
