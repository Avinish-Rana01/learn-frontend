import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLesson, markLessonComplete, LessonDetail } from './lessons.service';
import { ApiClientError } from './client';

describe('Frontend Lessons API Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockLesson: LessonDetail = {
    id: 'l-1',
    slug: 'intro-to-vcs',
    title: 'Introduction to Version Control',
    description: 'Learn VCS fundamentals',
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
      title: 'Git Foundations',
    },
    contents: [
      {
        id: 'lc-1',
        contentType: 'HEADING',
        orderIndex: 1,
        body: 'Welcome to Git',
        metadata: JSON.stringify({ level: 2 }),
      },
    ],
    isCompleted: false,
    quiz: {
      id: 'q-1',
      title: 'VCS Checkpoint',
      description: null,
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
        title: 'Git Foundations',
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
        ],
      },
    ],
  };

  it('fetches full lesson details by ID', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              lesson: mockLesson,
            },
          }),
      })
    ) as unknown as typeof fetch;

    const lesson = await getLesson('l-1');
    expect(lesson.id).toBe('l-1');
    expect(lesson.title).toBe('Introduction to Version Control');
    expect(lesson.navigation?.nextLesson?.id).toBe('l-2');
    expect(lesson.contents).toHaveLength(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/lessons/l-1'),
      expect.anything()
    );
  });

  it('throws ApiClientError when lesson fetch fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 403,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () =>
          Promise.resolve({
            success: false,
            error: {
              code: 'LESSON_ACCESS_DENIED',
              message: 'This lesson requires course enrollment.',
            },
          }),
      })
    ) as unknown as typeof fetch;

    await expect(getLesson('l-locked')).rejects.toThrow(ApiClientError);
  });

  it('marks lesson complete successfully', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              progress: {
                lessonId: 'l-1',
                completed: true,
                completedAt: new Date().toISOString(),
              },
            },
          }),
      })
    ) as unknown as typeof fetch;

    const result = await markLessonComplete('l-1', true);
    expect(result.lessonId).toBe('l-1');
    expect(result.completed).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/lessons/l-1/progress'),
      expect.objectContaining({
        method: 'POST',
      })
    );
  });
});
