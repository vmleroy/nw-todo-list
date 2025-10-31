'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui/button';
import styles from './dashboard.module.css';
import { useAuth } from '../../../hooks/useAuth';

export default function DashboardPage() {
  const { user, signOut, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>TodoApp</h1>
          <Button
            className={styles.logoutButton}
            onClick={signOut}
          >
            Sign Out
          </Button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.welcomeSection}>
          <div className={styles.welcomeCard}>
            <div className={styles.avatar}>
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h1 className={styles.welcomeTitle}>
              Welcome back, {user.name}! 👋
            </h1>
            <p className={styles.welcomeSubtitle}>
              You are successfully logged into your dashboard
            </p>
          </div>
        </div>

        <div className={styles.actionsSection}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.actionButtons}>
            <Button
              className={styles.actionButton}
              onClick={() => alert('Todo list feature coming soon!')}
            >
              My Todo Lists
            </Button>
          </div>
        </div>

        <div className={styles.userInfoSection}>
          <h2 className={styles.sectionTitle}>Account Information</h2>
          <div className={styles.userInfoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Name:</span>
              <span className={styles.infoValue}>{user.name}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email:</span>
              <span className={styles.infoValue}>{user.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>User role:</span>
              <span className={styles.infoValue}>{user.role}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Status:</span>
              <span className={styles.statusActive}>Online</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
