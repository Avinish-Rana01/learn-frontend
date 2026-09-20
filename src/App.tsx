import { ThemeToggle } from '@/components/ThemeToggle';
import { BackendStatus } from '@/components/BackendStatus';

export function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-mono text-lg font-semibold tracking-tight">
            <span className="text-[var(--color-accent)]" aria-hidden="true">
              &lt;&gt;
            </span>
            <span>DevLearn</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex max-w-5xl flex-1 flex-col justify-center px-6 py-16">
        <div className="max-w-xl">
          <div className="mb-3 inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 font-mono text-xs text-[var(--color-accent)]">
            Step 1: Foundation (Frontend)
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Developer learning platform foundation
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)]">
            Decoupled React + TypeScript + Vite PWA frontend powered by the
            charcoal-and-orange design tokens, dark/light theme switching, and standalone
            API connectivity.
          </p>

          {/* Backend Connection Status */}
          <BackendStatus />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-4 text-center text-xs text-[var(--color-text-muted)]">
        DevLearn Platform • Frontend Service
      </footer>
    </div>
  );
}

export default App;
