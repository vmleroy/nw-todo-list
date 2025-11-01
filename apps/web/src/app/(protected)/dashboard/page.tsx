'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';
import { Avatar, AvatarFallback } from '@repo/ui/components/avatar';
import { TaskIcon } from '@/assets';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {user?.name}!
          </p>
        </header>

        {/* User Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="border rounded-lg">
                <div className="grid grid-cols-2 gap-0">
                  <div className="p-3 border-b border-r bg-muted/50">
                    <span className="text-sm font-medium text-muted-foreground">
                      Name
                    </span>
                  </div>
                  <div className="p-3 border-b">
                    <span className="text-foreground">{user?.name}</span>
                  </div>
                  <div className="p-3 border-b border-r bg-muted/50">
                    <span className="text-sm font-medium text-muted-foreground">
                      Email
                    </span>
                  </div>
                  <div className="p-3 border-b">
                    <span className="text-foreground">{user?.email}</span>
                  </div>
                  <div className="p-3 border-r bg-muted/50">
                    <span className="text-sm font-medium text-muted-foreground">
                      Role
                    </span>
                  </div>
                  <div className="p-3">
                    <span className="text-foreground">
                      {user?.role || 'USER'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Link href="/tasks" className="block">
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 justify-start"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <TaskIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-foreground">
                        Manage Tasks
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        View and organize your todo list
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
