import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CourseCatalogueView } from './CourseCatalogueView';
import * as coursesService from '@/services/api/courses.service';
import { ApiClientError } from '@/services/api/client';

describe('CourseCatalogueView', () => {
  const mockCourses: coursesService.CourseSummary[] = [
    {
      id: 'c-1',
      slug: 'git-masterclass',
      title: 'Git & GitHub Developer Masterclass',
      summary: 'Master version control from first principles.',
      description: 'Full course description.',
      thumbnailUrl: null,
      level: 'BEGINNER',
      isFree: true,
      moduleCount: 2,
      lessonCount: 4,
      isEnrolled: false,
      createdAt: '2026-09-20T00:00:00Z',
    },
    {
      id: 'c-2',
      slug: 'typescript-backend',
      title: 'Full-Stack TypeScript & Node.js',
      summary: 'Build robust APIs with Node.js and TypeScript.',
      description: 'Full course description.',
      thumbnailUrl: null,
      level: 'INTERMEDIATE',
      isFree: true,
      moduleCount: 3,
      lessonCount: 6,
      isEnrolled: true,
      createdAt: '2026-09-20T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading skeleton while fetching courses', async () => {
    vi.spyOn(coursesService, 'getCourses').mockImplementation(
      () => new Promise(() => {}) // pending promise
    );

    render(<CourseCatalogueView onSelectCourse={vi.fn()} />);

    expect(screen.getByTestId('courses-loading-skeleton')).toBeDefined();
  });

  it('renders course cards with correct metadata when API succeeds', async () => {
    vi.spyOn(coursesService, 'getCourses').mockResolvedValue(mockCourses);

    render(<CourseCatalogueView isAuthenticated={true} onSelectCourse={vi.fn()} />);

    await waitFor(() => {
      expect(screen.queryByTestId('courses-loading-skeleton')).toBeNull();
    });

    expect(screen.getByText('Git & GitHub Developer Masterclass')).toBeDefined();
    expect(screen.getByText('Full-Stack TypeScript & Node.js')).toBeDefined();
    expect(screen.getByText('2 Modules')).toBeDefined();
    expect(screen.getByText('4 Lessons')).toBeDefined();

    // Enrolled badge should be present for enrolled course
    expect(screen.getByTestId('enrolled-badge-typescript-backend')).toBeDefined();
  });

  it('calls onSelectCourse when user clicks action button on a card', async () => {
    const onSelect = vi.fn();
    vi.spyOn(coursesService, 'getCourses').mockResolvedValue(mockCourses);

    render(<CourseCatalogueView isAuthenticated={false} onSelectCourse={onSelect} />);

    await waitFor(() => {
      expect(screen.getByTestId('course-card-git-masterclass')).toBeDefined();
    });

    const actionBtn = screen.getByTestId('course-action-btn-git-masterclass');
    expect(actionBtn.textContent).toBe('View Course');
    fireEvent.click(actionBtn);

    expect(onSelect).toHaveBeenCalledWith('git-masterclass');
  });

  it('renders empty state when no courses exist', async () => {
    vi.spyOn(coursesService, 'getCourses').mockResolvedValue([]);

    render(<CourseCatalogueView onSelectCourse={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByTestId('courses-empty-state')).toBeDefined();
    });

    expect(screen.getByText('No courses available yet')).toBeDefined();
  });

  it('renders error state and retries fetching when user clicks retry', async () => {
    const spy = vi
      .spyOn(coursesService, 'getCourses')
      .mockRejectedValueOnce(new ApiClientError('Database connection timeout', 500))
      .mockResolvedValueOnce(mockCourses);

    render(<CourseCatalogueView onSelectCourse={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByTestId('courses-error-state')).toBeDefined();
    });
    expect(screen.getByText('Database connection timeout')).toBeDefined();

    // Click retry button
    const retryBtn = screen.getByTestId('retry-courses-btn');
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText('Git & GitHub Developer Masterclass')).toBeDefined();
    });
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
