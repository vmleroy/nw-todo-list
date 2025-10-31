import { TaskCreateDto, TaskResponseDto, TaskUpdateDto } from '@repo/api';

export abstract class TaskRepository {
  abstract create(
    userId: string,
    data: TaskCreateDto,
  ): Promise<TaskResponseDto>;
  abstract update(
    userId: string,
    taskId: string,
    data: TaskUpdateDto,
  ): Promise<TaskResponseDto>;
  abstract delete(userId: string, taskId: string): Promise<void>;
  abstract findAll(userId: string): Promise<TaskResponseDto[]>;
  abstract findById(
    userId: string,
    taskId: string,
  ): Promise<TaskResponseDto | null>;
  abstract getAll(): Promise<TaskResponseDto[]>;
}
