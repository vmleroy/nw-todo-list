export interface TaskEntity {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
  startDate?: string;
  dueDate?: string;
}
