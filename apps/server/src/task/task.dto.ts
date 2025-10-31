import { Task } from '@prisma/client';

export type TaskCreateDto = {
  title: string;
  description: string;
};

export type TaskUpdateDto = Partial<
  Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
>;

export type TaskResponseDto = Task;
