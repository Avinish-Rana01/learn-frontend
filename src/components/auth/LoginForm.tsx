import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      onSuccess?.();
    } catch (err) {
      setError(
        (err as Error).message || 'Failed to log in. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="login-form-container"
      className="w-full max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Sign In to DevLearn
        </h2>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Single-session developer learning platform
        </p>
      </div>

      {error && (
        <div
          data-testid="login-error-alert"
          role="alert"
          className="mb-4 rounded border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-medium text-[var(--color-text-secondary)]"
          >
            Email address
          </label>
          <input
            id="login-email"
            data-testid="login-email-input"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="developer@example.com"
            className="mt-1.5 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-xs font-medium text-[var(--color-text-secondary)]"
          >
            Password
          </label>
          <input
            id="login-password"
            data-testid="login-password-input"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1.5 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          data-testid="login-submit-button"
          disabled={isSubmitting}
          className="w-full rounded bg-[var(--color-accent)] py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {onSwitchToRegister && (
        <div className="mt-5 text-center text-xs text-[var(--color-text-muted)]">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            data-testid="switch-to-register-btn"
            onClick={onSwitchToRegister}
            className="font-medium text-[var(--color-accent)] hover:underline"
          >
            Create one
          </button>
        </div>
      )}
    </div>
  );
}
