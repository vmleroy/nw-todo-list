import { TaskCreateDto, TaskResponseDto, TaskUpdateDto } from './task.dto';

export abstract class TaskRepository {
  abstract create(userId: string, data: TaskCreateDto): Promise<void>;
  abstract update(
    userId: string,
    taskId: string,
    data: TaskUpdateDto,
  ): Promise<void>;
  abstract delete(userId: string, taskId: string): Promise<void>;
  abstract findAll(userId: string): Promise<TaskResponseDto[]>;
  abstract findById(
    userId: string,
    taskId: string,
  ): Promise<TaskResponseDto | null>;
  abstract getAll(): Promise<TaskResponseDto[]>;
}
