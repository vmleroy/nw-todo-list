'use client';

import { useAuth } from '@/hooks/useAuth';
import AdminTasksPageContainer from './containers/admin-container';
import UserTasksPageContainer from './containers/user-container';

export default function TasksPageContainer() {
  const { user } = useAuth();

  return (
    <>
      {user?.role === 'ADMIN' ? (
        <AdminTasksPageContainer />
      ) : user?.role === 'USER' ? (
        <UserTasksPageContainer />
      ) : (
        <div>Unauthorized</div>
      )}
    </>
  );
}
