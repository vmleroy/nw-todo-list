import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';
import { Checkbox } from '@repo/ui/components/checkbox';
import { Trash2, Edit, User } from 'lucide-react';
import { cn } from '@repo/ui/lib/utils';
import { TaskEntity, UpdateTaskData } from '@repo/api';
import { useState } from 'react';
import { TaskEditDialog } from './task-edit-dialog';

interface TaskCardProps {
  task: TaskEntity;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (id: string, updatedTask: UpdateTaskData) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const { id, title, description, completed, dueDate, user } = task;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (updatedTask: UpdateTaskData) => {
    onEdit(id, updatedTask);
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <Card
        className={cn('transition-all duration-200', completed && 'opacity-60')}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <Checkbox
                checked={completed}
                onCheckedChange={() => onToggle(id, !completed)}
                className="mt-1"
              />
              <div className="space-y-1 flex-1">
                <CardTitle
                  className={cn(
                    'text-base leading-tight',
                    completed && 'line-through text-muted-foreground',
                  )}
                >
                  {title}
                </CardTitle>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        {dueDate && (
          <CardContent className="pt-0">
            <div className="flex items-center justify-end">
              <span className="text-xs text-muted-foreground">
                Due: {new Date(dueDate).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        )}
      </Card>

      <TaskEditDialog
        task={task}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleEdit}
      />
    </>
  );
}
