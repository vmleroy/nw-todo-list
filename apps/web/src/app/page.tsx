'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui/button';
import { useAuth } from '../hooks/useAuth';
import styles from './page.module.css';

interface AuthFormData {
  name?: string;
  email: string;
  password: string;
}

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    email: '',
    password: '',
  });

  const { user, loading, error, signIn, signUp, clearError, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (isSignUp) {
      const success = await signUp(formData);
      if (success) {
        // After successful signup, switch to sign in
        setIsSignUp(false);
        setFormData({ email: formData.email, password: '' });
      }
    } else {
      const success = await signIn(formData);
      if (success) {
        // The useEffect above will handle the redirect
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.authCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className={styles.subtitle}>
              {isSignUp
                ? 'Sign up to get started with your todo list'
                : 'Sign in to your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {isSignUp && (
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <Button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading
                ? 'Loading...'
                : isSignUp
                ? 'Create Account'
                : 'Sign In'}
            </Button>
          </form>

          <div className={styles.toggleForm}>
            <span>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                clearError();
                setFormData({ email: '', password: '' });
              }}
              className={styles.toggleButton}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
