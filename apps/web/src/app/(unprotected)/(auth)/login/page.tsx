import { AuthSignInForm } from '@/components/pages/login';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold">Todo List</h1>
        </header>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold">
              Sign in to your account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AuthSignInForm />
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="link" asChild>
            <Link href="/register">Don&apos;t have an account? Sign up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
