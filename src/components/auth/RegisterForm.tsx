import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters long.');
      return;
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      setError(
        'Password must be at least 8 characters and include uppercase, lowercase, and numeric characters.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });
      onSuccess?.();
    } catch (err) {
      setError((err as Error).message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="register-form-container"
      className="w-full max-w-md rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Create DevLearn Account
        </h2>
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
          Join the developer learning platform
        </p>
      </div>

      {error && (
        <div
          data-testid="register-error-alert"
          role="alert"
          className="mb-4 rounded border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="register-fullname"
            className="block text-xs font-medium text-[var(--color-text-secondary)]"
          >
            Full Name
          </label>
          <input
            id="register-fullname"
            data-testid="register-fullname-input"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ada Lovelace"
            className="mt-1.5 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="register-email"
            className="block text-xs font-medium text-[var(--color-text-secondary)]"
          >
            Email address
          </label>
          <input
            id="register-email"
            data-testid="register-email-input"
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
            htmlFor="register-password"
            className="block text-xs font-medium text-[var(--color-text-secondary)]"
          >
            Password
          </label>
          <input
            id="register-password"
            data-testid="register-password-input"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 chars with A-Z, a-z, 0-9"
            className="mt-1.5 w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none"
          />
          <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
            Must contain at least 8 characters, one uppercase letter, and one number.
          </p>
        </div>

        <button
          type="submit"
          data-testid="register-submit-button"
          disabled={isSubmitting}
          className="w-full rounded bg-[var(--color-accent)] py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      {onSwitchToLogin && (
        <div className="mt-5 text-center text-xs text-[var(--color-text-muted)]">
          Already have an account?{' '}
          <button
            type="button"
            data-testid="switch-to-login-btn"
            onClick={onSwitchToLogin}
            className="font-medium text-[var(--color-accent)] hover:underline"
          >
            Sign in
          </button>
        </div>
      )}
    </div>
  );
}
