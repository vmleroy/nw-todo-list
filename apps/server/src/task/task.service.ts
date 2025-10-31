import { PrismaService } from '#/prisma.service';
import { TaskCreateDto, TaskResponseDto, TaskUpdateDto } from './task.dto';
import { TaskRepository } from './task.repository';

export class TaskService extends TaskRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async create(userId: string, data: TaskCreateDto): Promise<void> {
    await this.prismaService.task.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }

  async update(
    userId: string,
    taskId: string,
    data: TaskUpdateDto,
  ): Promise<void> {
    await this.prismaService.task.update({
      where: { id: taskId, userId },
      data,
    });
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
    return tasks.map((task) => ({
      ...task,
      userId: undefined,
    }));
  }

  async findById(
    userId: string,
    taskId: string,
  ): Promise<TaskResponseDto | null> {
    const task = await this.prismaService.task.findUnique({
      where: { id: taskId, userId },
    });
    return task ? { ...task, userId: undefined } : null;
  }

  async getAll(): Promise<TaskResponseDto[]> {
    return this.prismaService.task.findMany();
  }
}
