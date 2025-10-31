'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui/button';
import { useAuth } from '../../../hooks/useAuth';
import styles from './tasks.module.css';
import { useTaskManager } from '../../../hooks/useTask';
import { CreateTaskData, UpdateTaskData, TaskEntity } from '@repo/api';

export default function TasksPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    isCreating,
    isUpdating,
    isDeleting,
    isToggling,
  } = useTaskManager();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskEntity | null>(null);
  const [createFormData, setCreateFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createFormData.title.trim()) return;

    // Clean up the data before sending
    const cleanedData: CreateTaskData = {
      title: createFormData.title,
      description: createFormData.description || undefined,
      dueDate:
        createFormData.dueDate && createFormData.dueDate.trim() !== ''
          ? createFormData.dueDate
          : undefined,
      startDate:
        createFormData.startDate && createFormData.startDate.trim() !== ''
          ? createFormData.startDate
          : undefined,
    };

    createTask(cleanedData, {
      onSuccess: () => {
        setCreateFormData({ title: '', description: '' });
        setIsCreateModalOpen(false);
      },
    });
  };

  const handleUpdateTask = (taskId: string, data: UpdateTaskData) => {
    updateTask(
      { taskId, data },
      {
        onSuccess: () => {
          setEditingTask(null);
        },
      },
    );
  };

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    toggleComplete({ taskId, completed });
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h2>Error loading tasks</h2>
        <p>{error.message}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>My Tasks</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button onClick={() => router.push('/dashboard')} variant="outline">
              ← Dashboard
            </Button>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : '+ Add Task'}
            </Button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {tasks.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No tasks yet</h2>
            <p>Create your first task to get started!</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Task
            </Button>
          </div>
        ) : (
          <div className={styles.taskGrid}>
            {tasks.map((task) => (
              <div key={task.id} className={styles.taskCard}>
                <div className={styles.taskHeader}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) =>
                      handleToggleComplete(task.id, e.target.checked)
                    }
                    disabled={isToggling}
                    className={styles.checkbox}
                  />
                  <h3
                    className={`${styles.taskTitle} ${task.completed ? styles.completed : ''}`}
                  >
                    {task.title}
                  </h3>
                </div>

                {task.description && (
                  <p className={styles.taskDescription}>{task.description}</p>
                )}

                <div className={styles.taskMeta}>
                  <span className={styles.createdAt}>
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                  {task.dueDate && (
                    <span className={styles.dueDate}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className={styles.taskActions}>
                  <Button
                    onClick={() => setEditingTask(task)}
                    disabled={isUpdating}
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteTask(task.id)}
                    disabled={isDeleting}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Task Modal */}
      {isCreateModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  value={createFormData.title}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      title: e.target.value,
                    })
                  }
                  required
                  disabled={isCreating}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={createFormData.description || ''}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      description: e.target.value,
                    })
                  }
                  disabled={isCreating}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="dueDate">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  value={createFormData.dueDate || ''}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      dueDate: e.target.value,
                    })
                  }
                  disabled={isCreating}
                />
              </div>

              <div className={styles.modalActions}>
                <Button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isCreating}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating || !createFormData.title.trim()}
                >
                  {isCreating ? 'Creating...' : 'Create Task'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Edit Task</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const updateData: UpdateTaskData = {
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  dueDate: (formData.get('dueDate') as string) || undefined,
                };
                handleUpdateTask(editingTask.id, updateData);
              }}
            >
              <div className={styles.formGroup}>
                <label htmlFor="editTitle">Title *</label>
                <input
                  type="text"
                  id="editTitle"
                  name="title"
                  defaultValue={editingTask.title}
                  required
                  disabled={isUpdating}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="editDescription">Description</label>
                <textarea
                  id="editDescription"
                  name="description"
                  defaultValue={editingTask.description || ''}
                  disabled={isUpdating}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="editDueDate">Due Date</label>
                <input
                  type="date"
                  id="editDueDate"
                  name="dueDate"
                  defaultValue={
                    editingTask.dueDate
                      ? new Date(editingTask.dueDate)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }
                  disabled={isUpdating}
                />
              </div>

              <div className={styles.modalActions}>
                <Button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  disabled={isUpdating}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Update Task'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
