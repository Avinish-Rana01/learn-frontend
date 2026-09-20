import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HealthStatus {
  status: string;
  service?: string;
  timestamp?: string;
}

export function App() {
  const [backendStatus, setBackendStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => {
        if (!res.ok) throw new Error('API unreachable');
        return res.json();
      })
      .then((data) => {
        setBackendStatus(data);
        setLoading(false);
      })
      .catch(() => {
        setBackendStatus(null);
        setLoading(false);
      });
  }, []);

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
            Decoupled React + TypeScript + Vite PWA frontend powered by the charcoal-and-orange
            design tokens, dark/light theme switching, and standalone API connectivity.
          </p>

          {/* Backend Connection Status */}
          <div className="mt-6 flex items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 text-xs">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                backendStatus ? 'bg-[var(--color-progress)]' : 'bg-[var(--color-text-muted)]'
              }`}
              aria-hidden="true"
            />
            <span className="text-[var(--color-text-primary)] font-medium">
              Backend API Status:
            </span>
            <span className="text-[var(--color-text-muted)]">
              {loading
                ? 'Connecting to backend...'
                : backendStatus
                  ? `Connected (${backendStatus.service || 'backend ok'})`
                  : 'Backend offline (run backend on port 4000)'}
            </span>
          </div>
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
