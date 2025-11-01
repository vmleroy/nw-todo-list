import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Checkbox } from '@repo/ui/components/checkbox';
import { cn } from '@repo/ui/lib/utils';
import { TaskEntity } from '@repo/api';
import { User } from 'lucide-react';

interface TaskCardProps {
  task: TaskEntity;
}

export function TaskCard({ task }: TaskCardProps) {
  const { title, description, completed, dueDate, user } = task;

  return (
    <>
      <Card
        className={cn('transition-all duration-200', completed && 'opacity-60')}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <Checkbox checked={completed} className="mt-1" />
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
                {/* Add creator information */}
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>Created by: {user.name} - {user.email}</span>
                </div>
              </div>
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
    </>
  );
}
