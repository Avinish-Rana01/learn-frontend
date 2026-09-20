import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        data-testid="protected-route-loading"
        className="flex min-h-[200px] items-center justify-center p-8 text-xs text-[var(--color-text-muted)]"
      >
        <span className="animate-pulse">Checking authentication status...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div
        data-testid="protected-route-unauthenticated"
        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center"
      >
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
          Authentication Required
        </h3>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Please sign in to access this protected area.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
