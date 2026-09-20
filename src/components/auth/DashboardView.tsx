import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export function DashboardView() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) return null;

  return (
    <div
      data-testid="dashboard-view"
      className="w-full max-w-xl space-y-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm"
    >
      <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-4">
        <div>
          <span className="inline-block rounded bg-[var(--color-accent)]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--color-accent)]">
            {user.role}
          </span>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Welcome, {user.fullName}
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">{user.email}</p>
        </div>

        <button
          type="button"
          data-testid="dashboard-logout-button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-50"
        >
          {isLoggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>

      {/* Session Security Indicator */}
      <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full bg-[var(--color-progress)]"
            aria-hidden="true"
          />
          <span className="text-xs font-semibold text-[var(--color-text-primary)]">
            Single Active Session: Active &amp; Verified
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
          This session is backed by a server-controlled record in the database. If you log
          in on another device or browser, this session will immediately be invalidated by
          the backend security engine.
        </p>
      </div>

      {/* Account Details */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between border-b border-[var(--color-border)]/50 py-1">
          <span className="text-[var(--color-text-muted)]">Account ID</span>
          <span className="font-mono text-[var(--color-text-primary)]">{user.id}</span>
        </div>
        <div className="flex justify-between border-b border-[var(--color-border)]/50 py-1">
          <span className="text-[var(--color-text-muted)]">Registered Email</span>
          <span className="font-mono text-[var(--color-text-primary)]">{user.email}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[var(--color-text-muted)]">Role Authorization</span>
          <span className="font-semibold text-[var(--color-progress)]">{user.role}</span>
        </div>
      </div>
    </div>
  );
}
