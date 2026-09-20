import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BackendStatus } from '@/components/BackendStatus';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { DashboardView } from '@/components/auth/DashboardView';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

type ViewMode = 'home' | 'login' | 'register' | 'dashboard';

function AppContent() {
  const { user, isAuthenticated, sessionAlert, clearSessionAlert, logout } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('home');

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      {/* Navigation Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 font-mono text-lg font-semibold tracking-tight focus:outline-none"
          >
            <span className="text-[var(--color-accent)]" aria-hidden="true">
              &lt;&gt;
            </span>
            <span>DevLearn</span>
          </button>

          <nav className="flex items-center gap-3 text-xs">
            <button
              type="button"
              data-testid="nav-home"
              onClick={() => setCurrentView('home')}
              className={`rounded px-2.5 py-1.5 font-medium transition-colors ${
                currentView === 'home'
                  ? 'bg-[var(--color-bg)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              Home
            </button>

            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  data-testid="nav-dashboard"
                  onClick={() => setCurrentView('dashboard')}
                  className={`rounded px-2.5 py-1.5 font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-[var(--color-bg)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  Dashboard
                </button>
                <div className="hidden items-center gap-2 border-l border-[var(--color-border)] pl-2 sm:flex">
                  <span className="max-w-[120px] truncate text-[var(--color-text-muted)]">
                    {user?.fullName}
                  </span>
                  <span className="rounded bg-[var(--color-accent)]/10 px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-accent)]">
                    {user?.role}
                  </span>
                </div>
                <button
                  type="button"
                  data-testid="nav-logout"
                  onClick={async () => {
                    await logout();
                    setCurrentView('home');
                  }}
                  className="rounded border border-[var(--color-border)] px-2.5 py-1 text-[var(--color-text-muted)] hover:border-red-500/50 hover:text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  data-testid="nav-login"
                  onClick={() => setCurrentView('login')}
                  className={`rounded px-2.5 py-1.5 font-medium transition-colors ${
                    currentView === 'login'
                      ? 'bg-[var(--color-bg)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  data-testid="nav-register"
                  onClick={() => setCurrentView('register')}
                  className="rounded bg-[var(--color-accent)] px-3 py-1.5 font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Register
                </button>
              </>
            )}

            <div className="border-l border-[var(--color-border)] pl-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>

      {/* Single Active Session Invalidation Alert Banner */}
      {sessionAlert && (
        <div
          role="alert"
          data-testid="session-invalidation-banner"
          className="border-b border-amber-500/30 bg-amber-500/10 px-6 py-3 text-xs text-amber-300"
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-amber-400">Notice:</span>
              <span>{sessionAlert}</span>
            </div>
            <button
              type="button"
              data-testid="dismiss-session-alert-btn"
              onClick={clearSessionAlert}
              className="font-medium text-amber-400 underline hover:text-amber-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="mx-auto flex max-w-5xl flex-1 flex-col justify-center px-6 py-12">
        {currentView === 'home' && (
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 font-mono text-xs text-[var(--color-accent)]">
              Step 3: Authentication &amp; Sessions
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Developer learning platform foundation
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Server-controlled authentication engine with strict single active session
              enforcement per account, JWT rotation, and decoupled PWA frontend.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {!isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentView('login')}
                    className="rounded bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Sign In to Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('register')}
                    className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold text-[var(--color-text-primary)] hover:border-[var(--color-accent)]"
                  >
                    Create Account
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentView('dashboard')}
                  className="rounded bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Go to Protected Dashboard
                </button>
              )}
            </div>

            {/* Backend & Database Connection Status */}
            <BackendStatus />
          </div>
        )}

        {currentView === 'login' && (
          <div className="flex justify-center">
            <LoginForm
              onSuccess={() => setCurrentView('dashboard')}
              onSwitchToRegister={() => setCurrentView('register')}
            />
          </div>
        )}

        {currentView === 'register' && (
          <div className="flex justify-center">
            <RegisterForm
              onSuccess={() => setCurrentView('dashboard')}
              onSwitchToLogin={() => setCurrentView('login')}
            />
          </div>
        )}

        {currentView === 'dashboard' && (
          <div className="flex justify-center">
            <ProtectedRoute
              fallback={
                <LoginForm
                  onSuccess={() => setCurrentView('dashboard')}
                  onSwitchToRegister={() => setCurrentView('register')}
                />
              }
            >
              <DashboardView />
            </ProtectedRoute>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-4 text-center text-xs text-[var(--color-text-muted)]">
        DevLearn Platform • Decoupled Architecture
      </footer>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
