import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CourseOverviewView } from './CourseOverviewView';
import * as coursesService from '@/services/api/courses.service';
import { ApiClientError } from '@/services/api/client';

describe('CourseOverviewView', () => {
  const mockCourse: coursesService.CourseDetail = {
    id: 'c-1',
    slug: 'git-masterclass',
    title: 'Git & GitHub Developer Masterclass',
    summary: 'Master distributed version control.',
    description: 'Detailed explanation of Git internals and workflows.',
    thumbnailUrl: null,
    level: 'BEGINNER',
    isFree: true,
    isEnrolled: false,
    modules: [
      {
        id: 'm-1',
        title: 'Module 1: Git Foundations',
        description: 'Learn the basic commands and mental model.',
        orderIndex: 1,
        lessons: [
          {
            id: 'l-1',
            slug: 'intro-to-vcs',
            title: 'Introduction to Version Control',
            description: null,
            orderIndex: 1,
            isPreview: true,
            estimatedMinutes: 10,
          },
          {
            id: 'l-2',
            slug: 'staging-and-commits',
            title: 'Staging and Committing',
            description: null,
            orderIndex: 2,
            isPreview: false,
            estimatedMinutes: 15,
          },
        ],
      },
      {
        id: 'm-2',
        title: 'Module 2: Branching Strategies',
        description: 'Feature branching and merges.',
        orderIndex: 2,
        lessons: [
          {
            id: 'l-3',
            slug: 'git-branches',
            title: 'Working with Branches',
            description: null,
            orderIndex: 1,
            isPreview: false,
            estimatedMinutes: 20,
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading skeleton initially', () => {
    vi.spyOn(coursesService, 'getCourseBySlug').mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <CourseOverviewView
        slug="git-masterclass"
        onBackToCourses={vi.fn()}
        onRequireAuth={vi.fn()}
      />
    );

    expect(screen.getByTestId('course-overview-loading')).toBeDefined();
  });

  it('renders course hero, modules, and lessons in canonical order', async () => {
    vi.spyOn(coursesService, 'getCourseBySlug').mockResolvedValue(mockCourse);

    render(
      <CourseOverviewView
        slug="git-masterclass"
        isAuthenticated={false}
        onBackToCourses={vi.fn()}
        onRequireAuth={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.queryByTestId('course-overview-loading')).toBeNull();
    });

    expect(screen.getByText('Git & GitHub Developer Masterclass')).toBeDefined();
    expect(screen.getByText('Module 1: Git Foundations')).toBeDefined();
    expect(screen.getByText('Module 2: Branching Strategies')).toBeDefined();
    expect(screen.getByText('Introduction to Version Control')).toBeDefined();
    expect(screen.getByText('Staging and Committing')).toBeDefined();

    // Check preview badge vs locked badge
    expect(screen.getByTestId('preview-badge-l-1')).toBeDefined();
    expect(screen.getByTestId('locked-badge-l-2')).toBeDefined();
  });

  it('triggers onRequireAuth when unauthenticated user clicks Sign In to Enroll', async () => {
    const onRequireAuth = vi.fn();
    vi.spyOn(coursesService, 'getCourseBySlug').mockResolvedValue(mockCourse);

    render(
      <CourseOverviewView
        slug="git-masterclass"
        isAuthenticated={false}
        onBackToCourses={vi.fn()}
        onRequireAuth={onRequireAuth}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('hero-signin-enroll-btn')).toBeDefined();
    });

    fireEvent.click(screen.getByTestId('hero-signin-enroll-btn'));
    expect(onRequireAuth).toHaveBeenCalledTimes(1);
  });

  it('enables authenticated user to enroll and updates UI to enrolled state', async () => {
    vi.spyOn(coursesService, 'getCourseBySlug').mockResolvedValue({
      ...mockCourse,
      isEnrolled: false,
    });
    const enrollSpy = vi.spyOn(coursesService, 'enrollInCourse').mockResolvedValue({
      id: 'enr-1',
      courseId: 'c-1',
      status: 'ACTIVE',
    });
    vi.spyOn(coursesService, 'getCourseProgress').mockResolvedValue({
      courseId: 'c-1',
      totalLessons: 3,
      completedLessons: 0,
      percentage: 0,
      completedLessonIds: [],
    });

    render(
      <CourseOverviewView
        slug="git-masterclass"
        isAuthenticated={true}
        onBackToCourses={vi.fn()}
        onRequireAuth={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('hero-enroll-now-btn')).toBeDefined();
    });

    fireEvent.click(screen.getByTestId('hero-enroll-now-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('hero-enrolled-badge')).toBeDefined();
    });
    expect(enrollSpy).toHaveBeenCalledWith('c-1');
    expect(screen.getByTestId('hero-continue-learning-btn')).toBeDefined();
    expect(screen.getByTestId('learner-notice-banner')).toBeDefined();
  });

  it('displays progress bar when user is enrolled and progress exists', async () => {
    vi.spyOn(coursesService, 'getCourseBySlug').mockResolvedValue({
      ...mockCourse,
      isEnrolled: true,
    });
    vi.spyOn(coursesService, 'getCourseProgress').mockResolvedValue({
      courseId: 'c-1',
      totalLessons: 3,
      completedLessons: 2,
      percentage: 67,
      completedLessonIds: ['l-1', 'l-2'],
    });

    render(
      <CourseOverviewView
        slug="git-masterclass"
        isAuthenticated={true}
        onBackToCourses={vi.fn()}
        onRequireAuth={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('course-progress-container')).toBeDefined();
    });

    expect(screen.getByText('2 / 3 completed (67%)')).toBeDefined();
    const progressBar = screen.getByTestId('course-progress-bar');
    expect(progressBar.style.width).toBe('67%');
  });

  it('renders 404 state when course is not found', async () => {
    vi.spyOn(coursesService, 'getCourseBySlug').mockRejectedValue(
      new ApiClientError('Course not found', 404, 'COURSE_NOT_FOUND')
    );

    render(
      <CourseOverviewView
        slug="non-existent-course"
        onBackToCourses={vi.fn()}
        onRequireAuth={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('course-not-found-state')).toBeDefined();
    });

    expect(screen.getByText('Course Not Found')).toBeDefined();
  });

  it('navigates back to courses when back button is clicked', async () => {
    const onBack = vi.fn();
    vi.spyOn(coursesService, 'getCourseBySlug').mockResolvedValue(mockCourse);

    render(
      <CourseOverviewView
        slug="git-masterclass"
        onBackToCourses={onBack}
        onRequireAuth={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('back-to-courses-btn')).toBeDefined();
    });

    fireEvent.click(screen.getByTestId('back-to-courses-btn'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
