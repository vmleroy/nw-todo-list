import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';
import { AuthSignUpForm } from '@/components/pages/login';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold">Todo List</h1>
        </header>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold">
              Create your account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AuthSignUpForm />
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="link" asChild>
            <Link href="/register">Already have an account? Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
