import { useEffect, useState } from 'react';
import { getHealthStatus, HealthResponse } from '../services/api/health.service';

export function BackendStatus() {
  const [backendStatus, setBackendStatus] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getHealthStatus()
      .then((data) => {
        if (isMounted) {
          setBackendStatus(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setBackendStatus(null);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      data-testid="backend-status"
      className="mt-6 flex flex-col gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 text-xs sm:flex-row sm:items-center sm:gap-3"
    >
      <div className="flex items-center gap-2">
        <span
          data-testid="backend-status-indicator"
          className={`h-2.5 w-2.5 rounded-full ${
            backendStatus ? 'bg-[var(--color-progress)]' : 'bg-[var(--color-text-muted)]'
          }`}
          aria-hidden="true"
        />
        <span className="font-medium text-[var(--color-text-primary)]">
          Backend API Status:
        </span>
      </div>

      <span data-testid="backend-status-text" className="text-[var(--color-text-muted)]">
        {loading
          ? 'Connecting to backend...'
          : backendStatus
            ? `Connected (${backendStatus.service || 'backend ok'})${
                backendStatus.database ? ` • Database: ${backendStatus.database}` : ''
              }`
            : 'Backend offline (run backend on port 4000)'}
      </span>
    </div>
  );
}
