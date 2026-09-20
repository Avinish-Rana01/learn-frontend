import { ThemeToggle } from '@/components/ThemeToggle';
import { BackendStatus } from '@/components/BackendStatus';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { DashboardView } from '@/components/auth/DashboardView';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useRouter } from '@/hooks/useRouter';
import { CourseCatalogueView } from '@/components/courses/CourseCatalogueView';
import { CourseOverviewView } from '@/components/courses/CourseOverviewView';
import { LessonReaderView } from '@/components/lessons/LessonReaderView';

function AppContent() {
  const { user, isAuthenticated, sessionAlert, clearSessionAlert, logout } = useAuth();
  const { view, slug, lessonId, navigate } = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      {/* Navigation Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button
            type="button"
            data-testid="brand-logo-btn"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-mono text-lg font-semibold tracking-tight focus:outline-none"
          >
            <span className="text-[var(--color-accent)]" aria-hidden="true">
              &lt;&gt;
            </span>
            <span>DevLearn</span>
          </button>

          <nav
            className="flex items-center gap-2 text-xs sm:gap-3"
            aria-label="Main Navigation"
          >
            <button
              type="button"
              data-testid="nav-home"
              onClick={() => navigate('/')}
              className={`rounded px-2.5 py-1.5 font-medium transition-colors ${
                view === 'home'
                  ? 'bg-[var(--color-bg)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              data-testid="nav-courses"
              onClick={() => navigate('/courses')}
              className={`rounded px-2.5 py-1.5 font-medium transition-colors ${
                view === 'courses' || view === 'course-detail' || view === 'lesson'
                  ? 'bg-[var(--color-bg)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              Courses
            </button>

            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  data-testid="nav-dashboard"
                  onClick={() => navigate('/dashboard')}
                  className={`rounded px-2.5 py-1.5 font-medium transition-colors ${
                    view === 'dashboard'
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
                    navigate('/');
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
                  onClick={() => navigate('/login')}
                  className={`rounded px-2.5 py-1.5 font-medium transition-colors ${
                    view === 'login'
                      ? 'bg-[var(--color-bg)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  data-testid="nav-register"
                  onClick={() => navigate('/register')}
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
      <main
        className={`mx-auto flex w-full flex-1 flex-col justify-start px-6 py-8 sm:py-12 ${
          view === 'lesson' ? 'max-w-6xl' : 'max-w-5xl'
        }`}
      >
        {view === 'home' && (
          <div className="max-w-xl py-6">
            <div className="mb-3 inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 font-mono text-xs text-[var(--color-accent)]">
              Step 6: Lesson Reader &amp; Structured Content
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Developer learning platform foundation
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Engineered with a decoupled architecture, PostgreSQL domain models,
              server-controlled authentication, and interactive structured lesson reading.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                data-testid="home-explore-courses-btn"
                onClick={() => navigate('/courses')}
                className="rounded bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                Browse Course Catalogue &rarr;
              </button>

              {!isAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold text-[var(--color-text-primary)] hover:border-[var(--color-accent)]"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold text-[var(--color-text-primary)] hover:border-[var(--color-accent)]"
                  >
                    Create Account
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold text-[var(--color-text-primary)] hover:border-[var(--color-accent)]"
                >
                  My Dashboard
                </button>
              )}
            </div>

            {/* Backend & Database Connection Status */}
            <BackendStatus />
          </div>
        )}

        {view === 'courses' && (
          <CourseCatalogueView
            isAuthenticated={isAuthenticated}
            onSelectCourse={(selectedSlug) => navigate(`/courses/${selectedSlug}`)}
          />
        )}

        {view === 'course-detail' && (
          <CourseOverviewView
            slug={slug || ''}
            isAuthenticated={isAuthenticated}
            onBackToCourses={() => navigate('/courses')}
            onRequireAuth={() => navigate('/login')}
            onNavigateLesson={(targetLessonId) => navigate(`/learn/${targetLessonId}`)}
          />
        )}

        {view === 'lesson' && lessonId && (
          <LessonReaderView
            lessonId={lessonId}
            isAuthenticated={isAuthenticated}
            onNavigateLesson={(targetLessonId) => navigate(`/learn/${targetLessonId}`)}
            onNavigateCourse={(courseSlug) => navigate(`/courses/${courseSlug}`)}
            onNavigateCourses={() => navigate('/courses')}
            onRequireAuth={() => navigate('/login')}
          />
        )}

        {view === 'login' && (
          <div className="flex justify-center py-6">
            <LoginForm
              onSuccess={() => navigate('/dashboard')}
              onSwitchToRegister={() => navigate('/register')}
            />
          </div>
        )}

        {view === 'register' && (
          <div className="flex justify-center py-6">
            <RegisterForm
              onSuccess={() => navigate('/dashboard')}
              onSwitchToLogin={() => navigate('/login')}
            />
          </div>
        )}

        {view === 'dashboard' && (
          <div className="flex justify-center py-6">
            <ProtectedRoute
              fallback={
                <LoginForm
                  onSuccess={() => navigate('/dashboard')}
                  onSwitchToRegister={() => navigate('/register')}
                />
              }
            >
              <DashboardView />
            </ProtectedRoute>
          </div>
        )}

        {view === 'not-found' && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
            <div className="font-mono text-xs tracking-widest text-[var(--color-accent)] uppercase">
              404
            </div>
            <h1 className="mt-2 text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl">
              Page Not Found
            </h1>
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">
              The page you are looking for does not exist.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/courses')}
                className="rounded bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white"
              >
                Browse Courses
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-xs text-[var(--color-text-primary)]"
              >
                Return Home
              </button>
            </div>
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
