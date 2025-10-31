'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui/button';
import { useAuth } from '../../hooks/useAuth';
import styles from './dashboard.module.css';

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
            appName="dashboard"
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

        <div className={styles.content}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3 className={styles.statTitle}>Profile Status</h3>
              <p className={styles.statValue}>✅ Active</p>
            </div>
            
            <div className={styles.statCard}>
              <h3 className={styles.statTitle}>Account Type</h3>
              <p className={styles.statValue}>👤 User</p>
            </div>
            
            <div className={styles.statCard}>
              <h3 className={styles.statTitle}>Session</h3>
              <p className={styles.statValue}>🔒 Secured</p>
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
                <span className={styles.infoLabel}>User ID:</span>
                <span className={styles.infoValue}>{user.id}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Status:</span>
                <span className={styles.statusActive}>Online</span>
              </div>
            </div>
          </div>

          <div className={styles.actionsSection}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.actionButtons}>
              <Button
                className={styles.actionButton}
                onClick={() => alert('Profile settings coming soon!')}
                appName="dashboard"
              >
                Edit Profile
              </Button>
              <Button
                className={styles.actionButton}
                onClick={() => alert('Security settings coming soon!')}
                appName="dashboard"
              >
                Security Settings
              </Button>
              <Button
                className={styles.actionButton}
                onClick={() => alert('Todo list feature coming soon!')}
                appName="dashboard"
              >
                My Todo Lists
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}