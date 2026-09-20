import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getCourses,
  getCourseBySlug,
  getLesson,
  getQuiz,
  submitQuiz,
  markLessonProgress,
  getCourseProgress,
} from './courses.service';

describe('Frontend Courses & Learning Domain API Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches list of published courses', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              courses: [
                {
                  id: 'c-1',
                  slug: 'git-masterclass',
                  title: 'Git Masterclass',
                  level: 'BEGINNER',
                  isFree: true,
                  moduleCount: 2,
                  lessonCount: 6,
                  createdAt: new Date().toISOString(),
                },
              ],
            },
          }),
      })
    ) as unknown as typeof fetch;

    const courses = await getCourses();
    expect(courses).toHaveLength(1);
    expect(courses[0].slug).toBe('git-masterclass');
    expect(courses[0].lessonCount).toBe(6);
  });

  it('fetches course details by slug', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              course: {
                id: 'c-1',
                slug: 'git-masterclass',
                title: 'Git Masterclass',
                modules: [
                  {
                    id: 'm-1',
                    title: 'Basics',
                    orderIndex: 1,
                    lessons: [{ id: 'l-1', slug: 'init', title: 'Init', orderIndex: 1 }],
                  },
                ],
              },
            },
          }),
      })
    ) as unknown as typeof fetch;

    const course = await getCourseBySlug('git-masterclass');
    expect(course.title).toBe('Git Masterclass');
    expect(course.modules).toHaveLength(1);
  });

  it('fetches lesson with structured content blocks', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              lesson: {
                id: 'l-1',
                title: 'Git Init',
                contents: [
                  { id: 'b-1', contentType: 'HEADING', orderIndex: 1, body: 'Header' },
                  {
                    id: 'b-2',
                    contentType: 'CODE',
                    orderIndex: 2,
                    body: 'git init',
                    codeLanguage: 'bash',
                  },
                ],
              },
            },
          }),
      })
    ) as unknown as typeof fetch;

    const lesson = await getLesson('l-1');
    expect(lesson.title).toBe('Git Init');
    expect(lesson.contents).toHaveLength(2);
    expect(lesson.contents[1].contentType).toBe('CODE');
  });

  it('fetches learner-safe quiz without isCorrect', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              quiz: {
                id: 'q-1',
                title: 'Git Quiz',
                passingScore: 70,
                questions: [
                  {
                    id: 'ques-1',
                    text: 'Command?',
                    options: [
                      { id: 'opt-1', text: 'git init', orderIndex: 1 },
                      { id: 'opt-2', text: 'git start', orderIndex: 2 },
                    ],
                  },
                ],
              },
            },
          }),
      })
    ) as unknown as typeof fetch;

    const quiz = await getQuiz('q-1');
    expect(quiz.title).toBe('Git Quiz');
    expect(quiz.questions[0].options[0]).not.toHaveProperty('isCorrect');
  });

  it('submits quiz answers and receives server score calculation', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              result: {
                attemptId: 'att-1',
                score: 100,
                passed: true,
                passingScore: 70,
                totalQuestions: 1,
                correctCount: 1,
                submittedAt: new Date().toISOString(),
                results: [{ questionId: 'ques-1', isCorrect: true }],
              },
            },
          }),
      })
    ) as unknown as typeof fetch;

    const result = await submitQuiz('q-1', {
      answers: [{ questionId: 'ques-1', optionId: 'opt-1' }],
    });

    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
  });

  it('marks lesson progress and fetches course completion percentage', async () => {
    global.fetch = vi.fn((url: string) => {
      if (url.includes('/progress/lessons/')) {
        return Promise.resolve({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () =>
            Promise.resolve({
              success: true,
              data: { progress: { lessonId: 'l-1', completed: true } },
            }),
        });
      }
      return Promise.resolve({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              progress: {
                courseId: 'c-1',
                totalLessons: 4,
                completedLessons: 2,
                percentage: 50,
                completedLessonIds: ['l-1', 'l-2'],
              },
            },
          }),
      });
    }) as unknown as typeof fetch;

    const markResult = await markLessonProgress('l-1', true);
    expect(markResult.completed).toBe(true);

    const progress = await getCourseProgress('c-1');
    expect(progress.percentage).toBe(50);
    expect(progress.completedLessons).toBe(2);
  });
});
