import { useCreateTask, useDeleteTask, useTasks, useToggleTaskComplete, useUpdateTask } from "./operations/useTasks";

// Combined hook for easier task management
export const useTaskManager = () => {
  const tasksQuery = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const toggleCompleteMutation = useToggleTaskComplete();

  return {
    // Data
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    
    // Mutations
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    toggleComplete: toggleCompleteMutation.mutate,
    
    // Loading states
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    isToggling: toggleCompleteMutation.isPending,
    
    // Refetch
    refetch: tasksQuery.refetch,
  };
};