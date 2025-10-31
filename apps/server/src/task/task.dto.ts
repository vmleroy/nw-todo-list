import { Task } from '@prisma/client';

export type TaskCreateDto = Omit<
  Task,
  'id' | 'completed' | 'createdAt' | 'updatedAt' | 'userId'
>;

export type TaskUpdateDto = Partial<
  Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
>;

export type TaskResponseDto = Omit<Task, 'userId'>;
