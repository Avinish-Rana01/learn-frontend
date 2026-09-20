import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@/lib/theme';
import { App } from './App';
import * as coursesService from '@/services/api/courses.service';

describe('DevLearn App Shell & Navigation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.history.pushState({}, '', '/');
  });

  it('renders the DevLearn brand logo and foundation heading on home route', () => {
    global.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch;

    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    expect(screen.getByText('DevLearn')).toBeDefined();
    expect(screen.getByText('Developer learning platform foundation')).toBeDefined();
    expect(screen.getByTestId('nav-courses')).toBeDefined();
  });

  it('navigates to courses catalogue when clicking Courses nav link', async () => {
    global.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch;
    vi.spyOn(coursesService, 'getCourses').mockResolvedValue([]);

    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    const coursesNavBtn = screen.getByTestId('nav-courses');
    fireEvent.click(coursesNavBtn);

    await waitFor(() => {
      expect(screen.getByText('Explore Courses')).toBeDefined();
    });
    expect(window.location.pathname).toBe('/courses');
  });

  it('navigates to courses catalogue when clicking Browse Course Catalogue CTA on home', async () => {
    global.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch;
    vi.spyOn(coursesService, 'getCourses').mockResolvedValue([]);

    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    const exploreBtn = screen.getByTestId('home-explore-courses-btn');
    fireEvent.click(exploreBtn);

    await waitFor(() => {
      expect(screen.getByText('Explore Courses')).toBeDefined();
    });
    expect(window.location.pathname).toBe('/courses');
  });

  it('navigates back to home when clicking brand logo', async () => {
    global.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch;
    vi.spyOn(coursesService, 'getCourses').mockResolvedValue([]);

    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );

    // Go to courses
    fireEvent.click(screen.getByTestId('nav-courses'));
    await waitFor(() => {
      expect(screen.getByText('Explore Courses')).toBeDefined();
    });

    // Click logo
    fireEvent.click(screen.getByTestId('brand-logo-btn'));
    await waitFor(() => {
      expect(screen.getByText('Developer learning platform foundation')).toBeDefined();
    });
    expect(window.location.pathname).toBe('/');
  });
});
