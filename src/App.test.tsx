import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/lib/theme';
import { App } from './App';

describe('App Starter Page', () => {
  it('renders the DevLearn brand logo and foundation heading', () => {
    global.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch;

    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    expect(screen.getByText('DevLearn')).toBeDefined();
    expect(screen.getByText('Developer learning platform foundation')).toBeDefined();
  });
});
