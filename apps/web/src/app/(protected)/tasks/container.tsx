'use client';

import { TaskCreateDialog } from '@/components/pages/tasks/task-create-dialog';
import TaskList from '@/components/pages/tasks/task-list';
import { useTaskManager } from '@/hooks/useTask';
import { CreateTaskData, UpdateTaskData } from '@repo/api';
import { Button } from '@repo/ui/components/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/tabs';
import { useMemo, useState } from 'react';

export default function TasksPageContainer() {
  const { tasks, createTask, deleteTask, updateTask, toggleComplete } =
    useTaskManager();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const pendingTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks],
  );
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks],
  );

  const handleCreateTask = (task: CreateTaskData) => {
    const taskData = {
      ...task,
      startDate: new Date().toISOString(),
    };
    createTask(taskData);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleUpdateTask = (taskId: string, updatedData: UpdateTaskData) => {
    updateTask({
      taskId,
      data: updatedData,
    });
  };

  const handleToggleTaskComplete = (taskId: string, completed: boolean) => {
    toggleComplete({
      taskId,
      completed,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>Add Task</Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger className="cursor-pointer" value="all">
            All
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="pending">
            Pending
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="completed">
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-3">
            <TaskList
              tasks={tasks}
              onTaskComplete={handleToggleTaskComplete}
              onTaskDelete={handleDeleteTask}
              onTaskEdit={handleUpdateTask}
            />
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="space-y-3">
            <TaskList
              tasks={pendingTasks}
              onTaskComplete={handleToggleTaskComplete}
              onTaskDelete={handleDeleteTask}
              onTaskEdit={handleUpdateTask}
            />
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="space-y-3">
            <TaskList
              tasks={completedTasks}
              onTaskComplete={handleToggleTaskComplete}
              onTaskDelete={handleDeleteTask}
              onTaskEdit={handleUpdateTask}
            />
          </div>
        </TabsContent>
      </Tabs>

      <TaskCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSave={handleCreateTask}
      />
    </div>
  );
}
