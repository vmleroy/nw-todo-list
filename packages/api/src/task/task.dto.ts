export type TaskCreateDto = {
  title: string;
  description?: string;
  startDate?: string | Date;
  dueDate?: string | Date;
};

export type TaskUpdateDto = Partial<{
  title: string;
  description: string;
  completed: boolean;
  startDate: string | Date;
  dueDate: string | Date;
}>;

export type TaskResponseDto = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  startDate: Date | null;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
