import { useEffect, useState } from 'react';

export interface HealthStatus {
  status: string;
  service?: string;
  timestamp?: string;
}

interface BackendStatusProps {
  apiBaseUrl?: string;
}

export function BackendStatus({
  apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '',
}: BackendStatusProps) {
  const [backendStatus, setBackendStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = apiBaseUrl
      ? `${apiBaseUrl.replace(/\/$/, '')}/api/v1/health`
      : '/api/v1/health';

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('API unreachable');
        return res.json();
      })
      .then((data: HealthStatus) => {
        setBackendStatus(data);
        setLoading(false);
      })
      .catch(() => {
        setBackendStatus(null);
        setLoading(false);
      });
  }, [apiBaseUrl]);

  return (
    <div
      data-testid="backend-status"
      className="mt-6 flex items-center gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5 text-xs"
    >
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
      <span data-testid="backend-status-text" className="text-[var(--color-text-muted)]">
        {loading
          ? 'Connecting to backend...'
          : backendStatus
            ? `Connected (${backendStatus.service || 'backend ok'})`
            : 'Backend offline (run backend on port 4000)'}
      </span>
    </div>
  );
}
