import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LessonReaderView } from './LessonReaderView';
import * as lessonsService from '@/services/api/lessons.service';
import { ApiClientError } from '@/services/api/client';

describe('LessonReaderView Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockLesson: lessonsService.LessonDetail = {
    id: 'l-1',
    slug: 'intro-to-vcs',
    title: 'Introduction to Version Control',
    description: 'Learn the basic concepts of version control.',
    orderIndex: 1,
    isPreview: true,
    estimatedMinutes: 10,
    course: {
      id: 'c-1',
      slug: 'git-masterclass',
      title: 'Git & GitHub Developer Masterclass',
    },
    module: {
      id: 'm-1',
      title: 'Module 1: Git Foundations',
    },
    contents: [
      {
        id: 'b-1',
        contentType: 'HEADING',
        orderIndex: 1,
        body: 'Why Version Control?',
        metadata: JSON.stringify({ level: 2 }),
      },
      {
        id: 'b-2',
        contentType: 'TEXT',
        orderIndex: 2,
        body: 'Version control tracks code changes over time.',
      },
    ],
    isCompleted: false,
    quiz: {
      id: 'q-1',
      title: 'Git Foundations Checkpoint',
      description: 'Test your understanding of version control.',
      passingScore: 80,
    },
    navigation: {
      previousLesson: null,
      nextLesson: {
        id: 'l-2',
        title: 'Staging and Commits',
        slug: 'staging-and-commits',
        orderIndex: 2,
      },
    },
    syllabus: [
      {
        id: 'm-1',
        title: 'Module 1: Git Foundations',
        orderIndex: 1,
        lessons: [
          {
            id: 'l-1',
            title: 'Introduction to Version Control',
            slug: 'intro-to-vcs',
            orderIndex: 1,
            isPreview: true,
            estimatedMinutes: 10,
            isCompleted: false,
          },
          {
            id: 'l-2',
            title: 'Staging and Commits',
            slug: 'staging-and-commits',
            orderIndex: 2,
            isPreview: false,
            estimatedMinutes: 15,
            isCompleted: true,
          },
        ],
      },
      {
        id: 'm-2',
        title: 'Module 2: Branching',
        orderIndex: 2,
        lessons: [
          {
            id: 'l-3',
            title: 'Branching Basics',
            slug: 'branching-basics',
            orderIndex: 1,
            isPreview: false,
            estimatedMinutes: 20,
            isCompleted: false,
          },
        ],
      },
    ],
  };

  it('renders loading skeleton initially', () => {
    vi.spyOn(lessonsService, 'getLesson').mockImplementation(() => new Promise(() => {}));

    render(
      <LessonReaderView
        lessonId="l-1"
        onNavigateLesson={vi.fn()}
        onNavigateCourse={vi.fn()}
        onNavigateCourses={vi.fn()}
        onRequireAuth={vi.fn()}
      />
    );

    expect(screen.getByTestId('lesson-reader-loading')).toBeDefined();
  });

  it('renders lesson breadcrumbs, title, duration, preview badge, and contents', async () => {
    vi.spyOn(lessonsService, 'getLesson').mockResolvedValue(mockLesson);

    render(
      <LessonReaderView
        lessonId="l-1"
        onNavigateLesson={vi.fn()}
        onNavigateCourse={vi.fn()}
        onNavigateCourses={vi.fn()}
        onRequireAuth={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.queryByTestId('lesson-reader-loading')).toBeNull();
    });

    expect(screen.getByTestId('breadcrumb-course').textContent).toBe(
      'Git & GitHub Developer Masterclass'
    );
    expect(screen.getByTestId('breadcrumb-module').textContent).toBe(
      'Module 1: Git Foundations'
    );
    expect(screen.getByTestId('breadcrumb-lesson').textContent).toBe(
      'Introduction to Version Control'
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Introduction to Version Control'
    );
    expect(screen.getByText('~10 min read')).toBeDefined();
    expect(screen.getByText('Preview Available')).toBeDefined();

    expect(screen.getByText('Why Version Control?')).toBeDefined();
    expect(
      screen.getByText('Version control tracks code changes over time.')
    ).toBeDefined();
  });

  it('renders syllabus sidebar with current lesson highlighted and progress checkmarks', async () => {
    vi.spyOn(lessonsService, 'getLesson').mockResolvedValue(mockLesson);

    render(
      <LessonReaderView
        lessonId="l-1"
        onNavigateLesson={vi.fn()}
        onNavigateCourse={vi.fn()}
        onNavigateCourses={vi.fn()}
        onRequireAuth={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.queryByTestId('lesson-reader-loading')).toBeNull();
    });

    const sidebar = screen.getByTestId('lesson-sidebar');
    expect(sidebar).toBeDefined();

    // Lesson 1 is current
    const l1Btn = screen.getByTestId('sidebar-lesson-l-1');
    expect(l1Btn.className).toContain('text-[var(--color-accent)]');

    // Lesson 2 is completed
    const l2Btn = screen.getByTestId('sidebar-lesson-l-2');
    expect(l2Btn.textContent).toContain('✓');
  });

  it('navigates to next lesson when Next Lesson button is clicked', async () => {
    const onNavigateLesson = vi.fn();
    vi.spyOn(lessonsService, 'getLesson').mockResolvedValue(mockLesson);

    render(
      <LessonReaderView
        lessonId="l-1"
        onNavigateLesson={onNavigateLesson}
        onNavigateCourse={vi.fn()}
        onNavigateCourses={vi.fn()}
        onRequireAuth={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('next-lesson-btn')).toBeDefined();
    });

    fireEvent.click(screen.getByTestId('next-lesson-btn'));
    expect(onNavigateLesson).toHaveBeenCalledWith('l-2');
  });

  it('handles last lesson boundary with friendly end-of-course banner', async () => {
    const lastLesson: lessonsService.LessonDetail = {
      ...mockLesson,
      id: 'l-3',
      title: 'Branching Basics',
      navigation: {
        previousLesson: {
          id: 'l-2',
          title: 'Staging and Commits',
          slug: 'staging-and-commits',
          orderIndex: 2,
        },
        nextLesson: null,
      },
    };

    vi.spyOn(lessonsService, 'getLesson').mockResolvedValue(lastLesson);

    render(
      <LessonReaderView
        lessonId="l-3"
        onNavigateLesson={vi.fn()}
        onNavigateCourse={vi.fn()}
        onNavigateCourses={vi.fn()}
        onRequireAuth={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('course-completion-boundary')).toBeDefined();
    });

    expect(screen.queryByTestId('next-lesson-btn')).toBeNull();
    expect(
      screen.getByText("You've reached the end of this course section.")
    ).toBeDefined();
  });

  it('marks lesson complete idempotently and updates completion status', async () => {
    vi.spyOn(lessonsService, 'getLesson').mockResolvedValue(mockLesson);
    const markSpy = vi.spyOn(lessonsService, 'markLessonComplete').mockResolvedValue({
      lessonId: 'l-1',
      completed: true,
      completedAt: new Date().toISOString(),
    });

    render(
      <LessonReaderView
        lessonId="l-1"
        isAuthenticated={true}
        onNavigateLesson={vi.fn()}
        onNavigateCourse={vi.fn()}
        onNavigateCourses={vi.fn()}
        onRequireAuth={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('mark-complete-btn')).toBeDefined();
    });

    const btn = screen.getByTestId('mark-complete-btn');
    expect(btn.textContent).toContain('Mark Complete');

    fireEvent.click(btn);

    await waitFor(() => {
      expect(markSpy).toHaveBeenCalledWith('l-1', true);
      expect(screen.getByTestId('completed-badge')).toBeDefined();
    });

    expect(btn.textContent).toContain('Completed ✓');
  });

  it('handles mark complete failure gracefully without falsely marking complete', async () => {
    vi.spyOn(lessonsService, 'getLesson').mockResolvedValue(mockLesson);
    vi.spyOn(lessonsService, 'markLessonComplete').mockRejectedValue(
      new ApiClientError('Network timeout saving progress', 500)
    );

    render(
      <LessonReaderView
        lessonId="l-1"
        isAuthenticated={true}
        onNavigateLesson={vi.fn()}
        onNavigateCourse={vi.fn()}
        onNavigateCourses={vi.fn()}
        onRequireAuth={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('mark-complete-btn')).toBeDefined();
    });

    fireEvent.click(screen.getByTestId('mark-complete-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('progress-error-banner')).toBeDefined();
    });

    expect(screen.getByText('Network timeout saving progress')).toBeDefined();
    expect(screen.queryByTestId('completed-badge')).toBeNull();
  });

  it('renders 401 error state when authentication is required', async () => {
    const onRequireAuth = vi.fn();
    vi.spyOn(lessonsService, 'getLesson').mockRejectedValue(
      new ApiClientError('Your session has expired. Please sign in again.', 401)
    );

    render(
      <LessonReaderView
        lessonId="l-protected"
        onNavigateLesson={vi.fn()}
        onNavigateCourse={vi.fn()}
        onNavigateCourses={vi.fn()}
        onRequireAuth={onRequireAuth}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('lesson-auth-error')).toBeDefined();
    });

    expect(screen.getByText('Authentication Required')).toBeDefined();
    fireEvent.click(screen.getByTestId('auth-redirect-btn'));
    expect(onRequireAuth).toHaveBeenCalledTimes(1);
  });

  it('renders 403 access-denied state when enrollment is required', async () => {
    const onNavigateCourses = vi.fn();
    vi.spyOn(lessonsService, 'getLesson').mockRejectedValue(
      new ApiClientError('This lesson requires course access.', 403)
    );

    render(
      <LessonReaderView
        lessonId="l-protected"
        onNavigateLesson={vi.fn()}
        onNavigateCourse={vi.fn()}
        onNavigateCourses={onNavigateCourses}
        onRequireAuth={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('lesson-forbidden-error')).toBeDefined();
    });

    expect(screen.getByText('Course Access Required')).toBeDefined();
    fireEvent.click(screen.getByTestId('forbidden-return-btn'));
    expect(onNavigateCourses).toHaveBeenCalledTimes(1);
  });

  it('renders 404 state when lesson does not exist', async () => {
    const onNavigateCourses = vi.fn();
    vi.spyOn(lessonsService, 'getLesson').mockRejectedValue(
      new ApiClientError('Lesson not found.', 404)
    );

    render(
      <LessonReaderView
        lessonId="l-missing"
        onNavigateLesson={vi.fn()}
        onNavigateCourse={vi.fn()}
        onNavigateCourses={onNavigateCourses}
        onRequireAuth={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('lesson-not-found-error')).toBeDefined();
    });

    expect(screen.getByText('Lesson Not Found')).toBeDefined();
    fireEvent.click(screen.getByTestId('not-found-return-btn'));
    expect(onNavigateCourses).toHaveBeenCalledTimes(1);
  });
});
