'use client';

import TaskList from '@/components/pages/tasks/admin/task-list';
import { useTaskManager } from '@/hooks/useTask';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/tabs';
import { useMemo } from 'react';

export default function AdminTasksPageContainer() {
  const { tasks } = useTaskManager('ADMIN');

  const pendingTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks],
  );
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks],
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
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
            <TaskList tasks={tasks} />
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="space-y-3">
            <TaskList tasks={pendingTasks} />
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="space-y-3">
            <TaskList tasks={completedTasks} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
