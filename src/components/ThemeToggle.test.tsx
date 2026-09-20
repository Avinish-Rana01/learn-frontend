import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/lib/theme';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('renders with an accessible button label', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', {
      name: /switch to (light|dark) mode/i,
    });
    expect(button).toBeDefined();
  });

  it('toggles theme state when clicked', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    const initialText = button.textContent;
    fireEvent.click(button);
    expect(button.textContent).not.toBe(initialText);
  });
});
