import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BackendStatus } from './BackendStatus';

describe('BackendStatus', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders loading state initially', () => {
    global.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch;

    render(<BackendStatus />);
    expect(screen.getByTestId('backend-status-text').textContent).toContain(
      'Connecting to backend...'
    );
  });

  it('displays connected state on successful healthcheck response', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            status: 'ok',
            service: 'devlearn-backend',
            version: '1.0.0',
          }),
      })
    ) as unknown as typeof fetch;

    render(<BackendStatus />);

    await waitFor(() => {
      expect(screen.getByTestId('backend-status-text').textContent).toContain(
        'Connected (devlearn-backend)'
      );
    });

    const indicator = screen.getByTestId('backend-status-indicator');
    expect(indicator.className).toContain('bg-[var(--color-progress)]');
  });

  it('handles backend offline/unreachable safely without crashing', async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('Connection refused'))
    ) as unknown as typeof fetch;

    render(<BackendStatus />);

    await waitFor(() => {
      expect(screen.getByTestId('backend-status-text').textContent).toContain(
        'Backend offline (run backend on port 4000)'
      );
    });

    const indicator = screen.getByTestId('backend-status-indicator');
    expect(indicator.className).toContain('bg-[var(--color-text-muted)]');
  });
});
