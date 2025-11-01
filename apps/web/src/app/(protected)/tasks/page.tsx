import { Metadata } from 'next';
import TasksPageContainer from './container';

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'Manage your tasks and to-do items',
};

export default function TasksPage() {
  return <TasksPageContainer />;
}
