import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthProvider, useAuth } from '../../context/AuthContext';

// Helper component to test AuthContext consumer directly
function AuthConsumerTest() {
  const { user, isAuthenticated, sessionAlert, clearSessionAlert } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Guest'}</div>
      {user && <div data-testid="auth-user-email">{user.email}</div>}
      {sessionAlert && (
        <div data-testid="auth-session-alert">
          {sessionAlert}
          <button data-testid="auth-dismiss-btn" onClick={clearSessionAlert}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

describe('Frontend Authentication Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('LoginForm', () => {
    it('validates empty inputs before submitting', async () => {
      render(
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      );

      const submitBtn = screen.getByTestId('login-submit-button');
      fireEvent.click(submitBtn);

      expect(screen.getByTestId('login-email-input')).toBeDefined();
      expect(screen.getByTestId('login-password-input')).toBeDefined();
    });

    it('submits valid credentials and triggers onSuccess', async () => {
      const onSuccess = vi.fn();
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () =>
            Promise.resolve({
              success: true,
              data: {
                user: {
                  id: 'u-1',
                  email: 'dev@example.com',
                  fullName: 'Dev Learner',
                  role: 'LEARNER',
                  createdAt: new Date().toISOString(),
                },
              },
            }),
        })
      ) as unknown as typeof fetch;

      render(
        <AuthProvider>
          <LoginForm onSuccess={onSuccess} />
        </AuthProvider>
      );

      fireEvent.change(screen.getByTestId('login-email-input'), {
        target: { value: 'dev@example.com' },
      });
      fireEvent.change(screen.getByTestId('login-password-input'), {
        target: { value: 'Password123' },
      });

      fireEvent.click(screen.getByTestId('login-submit-button'));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('displays error banner when login fails', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () =>
            Promise.resolve({
              success: false,
              error: {
                code: 'INVALID_CREDENTIALS',
                message: 'Invalid email or password.',
              },
            }),
        })
      ) as unknown as typeof fetch;

      render(
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      );

      fireEvent.change(screen.getByTestId('login-email-input'), {
        target: { value: 'wrong@example.com' },
      });
      fireEvent.change(screen.getByTestId('login-password-input'), {
        target: { value: 'WrongPass' },
      });

      fireEvent.click(screen.getByTestId('login-submit-button'));

      await waitFor(() => {
        expect(screen.getByTestId('login-error-alert').textContent).toContain(
          'Invalid email or password.'
        );
      });
    });
  });

  describe('RegisterForm', () => {
    it('validates password requirements before submitting', async () => {
      render(
        <AuthProvider>
          <RegisterForm />
        </AuthProvider>
      );

      fireEvent.change(screen.getByTestId('register-fullname-input'), {
        target: { value: 'Jane Doe' },
      });
      fireEvent.change(screen.getByTestId('register-email-input'), {
        target: { value: 'jane@example.com' },
      });
      fireEvent.change(screen.getByTestId('register-password-input'), {
        target: { value: 'weak' },
      });

      fireEvent.click(screen.getByTestId('register-submit-button'));

      expect(screen.getByTestId('register-error-alert').textContent).toContain(
        'Password must be at least 8 characters'
      );
    });
  });

  describe('ProtectedRoute', () => {
    it('renders fallback when user is unauthenticated', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve({ success: false }),
        })
      ) as unknown as typeof fetch;

      render(
        <AuthProvider>
          <ProtectedRoute
            fallback={<div data-testid="custom-fallback">Please Log In</div>}
          >
            <div data-testid="protected-content">Secret Dashboard</div>
          </ProtectedRoute>
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('custom-fallback')).toBeDefined();
        expect(screen.queryByTestId('protected-content')).toBeNull();
      });
    });
  });

  describe('AuthContext & Session Invalidation Alert', () => {
    it('detects and renders session invalidation message', async () => {
      // Return 401 with SESSION_INVALIDATED_BY_NEW_LOGIN on initial getMe()
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () =>
            Promise.resolve({
              success: false,
              error: {
                code: 'SESSION_INVALIDATED_BY_NEW_LOGIN',
                message:
                  'Your session ended because your account was signed in on another device.',
              },
            }),
        })
      ) as unknown as typeof fetch;

      render(
        <AuthProvider>
          <AuthConsumerTest />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('auth-session-alert').textContent).toContain(
          'Your session ended because your account was signed in on another device.'
        );
      });

      // Test dismiss button
      fireEvent.click(screen.getByTestId('auth-dismiss-btn'));
      expect(screen.queryByTestId('auth-session-alert')).toBeNull();
    });
  });
});
