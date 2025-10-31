interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateTaskData {
  title: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
  startDate?: string;
  dueDate?: string;
}

export type { Task, CreateTaskData, UpdateTaskData };
