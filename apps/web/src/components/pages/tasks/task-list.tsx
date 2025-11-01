import { TaskEntity, UpdateTaskData } from '@repo/api';
import React from 'react';
import { TaskCard } from './task-card';

interface TaskListProps {
  tasks: TaskEntity[];
  onTaskComplete: (id: string, completed: boolean) => void;
  onTaskDelete: (id: string) => void;
  onTaskEdit: (id: string, updatedTask: UpdateTaskData) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskComplete,
  onTaskDelete,
  onTaskEdit,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No tasks yet. Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onTaskComplete}
          onDelete={onTaskDelete}
          onEdit={onTaskEdit}
        />
      ))}
    </div>
  );
};

export default TaskList;
