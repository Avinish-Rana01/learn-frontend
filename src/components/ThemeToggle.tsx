import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] cursor-pointer"
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
          <span>Light mode</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
          <span>Dark mode</span>
        </>
      )}
    </button>
  );
}
