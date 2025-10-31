import { PrismaService } from '#/prisma.service';
import { Injectable } from '@nestjs/common';
import { TaskCreateDto, TaskResponseDto, TaskUpdateDto } from '@repo/api';
import { TaskRepository } from './task.repository';
import { sanitizeDateToIso } from '#/utils/date-to-iso-time';

@Injectable()
export class TaskService extends TaskRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async create(userId: string, data: TaskCreateDto): Promise<TaskResponseDto> {
    // Sanitize date fields
    data.dueDate = sanitizeDateToIso(data.dueDate);
    data.startDate = sanitizeDateToIso(data.startDate);

    const task = await this.prismaService.task.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
    return task;
  }

  async update(
    userId: string,
    taskId: string,
    data: TaskUpdateDto,
  ): Promise<TaskResponseDto> {
    // Sanitize date fields
    data.dueDate = sanitizeDateToIso(data.dueDate);
    data.startDate = sanitizeDateToIso(data.startDate);

    const task = await this.prismaService.task.update({
      where: { id: taskId, userId },
      data: data,
    });
    return task;
  }

  async delete(userId: string, taskId: string): Promise<void> {
    await this.prismaService.task.delete({
      where: { id: taskId, userId },
    });
  }

  async findAll(userId: string): Promise<TaskResponseDto[]> {
    const tasks = await this.prismaService.task.findMany({
      where: { userId },
    });
    return tasks;
  }

  async findById(
    userId: string,
    taskId: string,
  ): Promise<TaskResponseDto | null> {
    const task = await this.prismaService.task.findUnique({
      where: { id: taskId, userId },
    });
    return task ? task : null;
  }

  async getAll(): Promise<TaskResponseDto[]> {
    return this.prismaService.task.findMany();
  }
}
