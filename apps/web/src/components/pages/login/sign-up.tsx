'use client';

import { useAuth } from '@/hooks/useAuth';
import { AuthSignUpDTO } from '@repo/api';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
  FormControl,
} from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { Button } from '@repo/ui/components/button';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

const defaultValues = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const AuthSignUpForm = () => {
  const { signUp } = useAuth();
  const router = useRouter();

  const form = useForm<AuthSignUpDTO>({
    resolver: zodResolver(defaultValues),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  const handleOnSubmit: SubmitHandler<AuthSignUpDTO> = async (data) => {
    const res = await signUp(data);

    if (res) {
      router.push('/login');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-6">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full cursor-pointer"
          type="submit"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          Sign up
        </Button>
      </form>
    </Form>
  );
};
