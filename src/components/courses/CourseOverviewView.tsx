import React, { useEffect, useState, useCallback } from 'react';
import {
  getCourseBySlug,
  enrollInCourse,
  getCourseProgress,
  CourseDetail,
  CourseProgress,
} from '@/services/api/courses.service';
import { ApiClientError } from '@/services/api/client';

interface CourseOverviewViewProps {
  slug: string;
  isAuthenticated?: boolean;
  onBackToCourses: () => void;
  onRequireAuth: () => void;
  onNavigateLesson?: (lessonId: string) => void;
}

export const CourseOverviewView: React.FC<CourseOverviewViewProps> = ({
  slug,
  isAuthenticated = false,
  onBackToCourses,
  onRequireAuth,
  onNavigateLesson,
}) => {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [learnerNotice, setLearnerNotice] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    getCourseBySlug(slug)
      .then(async (data) => {
        if (!isMounted) return;
        setCourse(data);

        if (isAuthenticated && data.isEnrolled) {
          try {
            const prog = await getCourseProgress(data.id);
            if (isMounted) {
              setProgress(prog);
            }
          } catch {
            // Optional progress
          }
        }
        if (isMounted) {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err instanceof ApiClientError && err.status === 404) {
          setIsNotFound(true);
        } else if (err instanceof ApiClientError) {
          setErrorMessage(err.message || 'Failed to load course details.');
        } else {
          setErrorMessage('Unable to connect to course services.');
        }
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug, isAuthenticated, retryCount]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsNotFound(false);
    setRetryCount((prev) => prev + 1);
  }, []);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    if (!course) return;

    setIsEnrolling(true);
    try {
      await enrollInCourse(course.id);
      setCourse((prev) => (prev ? { ...prev, isEnrolled: true } : prev));
      // Load initial progress after enrollment
      try {
        const prog = await getCourseProgress(course.id);
        setProgress(prog);
      } catch {
        // Non-blocking
      }
      setLearnerNotice(
        'Successfully enrolled! You now have full access to all curriculum modules.'
      );
    } catch (err) {
      if (err instanceof ApiClientError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Enrollment request failed. Please try again.');
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    if (onNavigateLesson && course) {
      let targetLessonId: string | null = null;
      for (const mod of course.modules) {
        for (const lesson of mod.lessons) {
          if (!targetLessonId) {
            targetLessonId = lesson.id;
          }
          if (
            progress?.completedLessonIds &&
            !progress.completedLessonIds.includes(lesson.id)
          ) {
            targetLessonId = lesson.id;
            break;
          }
        }
        if (
          targetLessonId &&
          progress?.completedLessonIds &&
          !progress.completedLessonIds.includes(targetLessonId)
        ) {
          break;
        }
      }
      if (targetLessonId) {
        onNavigateLesson(targetLessonId);
        return;
      }
    }
    setLearnerNotice('Enrollment active! Select a lesson below to start learning.');
  };

  // Calculate total duration in minutes
  const totalDurationMinutes =
    course?.modules.reduce(
      (sum, m) =>
        sum + m.lessons.reduce((lSum, l) => lSum + (l.estimatedMinutes || 0), 0),
      0
    ) || 0;

  const totalLessonsCount =
    course?.modules.reduce((sum, m) => sum + m.lessons.length, 0) || 0;

  return (
    <div className="w-full">
      {/* Back to Catalogue Navigation */}
      <nav className="mb-6">
        <button
          type="button"
          data-testid="back-to-courses-btn"
          onClick={onBackToCourses}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)] focus:outline-none"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Back to Courses</span>
        </button>
      </nav>

      {/* Loading Skeleton */}
      {isLoading && (
        <div
          data-testid="course-overview-loading"
          aria-busy="true"
          className="animate-pulse space-y-6"
        >
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
            <div className="h-4 w-20 rounded bg-[var(--color-bg)]" />
            <div className="mt-4 h-8 w-2/3 rounded bg-[var(--color-bg)]" />
            <div className="mt-3 h-4 w-full rounded bg-[var(--color-bg)]" />
            <div className="mt-6 flex gap-4">
              <div className="h-10 w-32 rounded bg-[var(--color-bg)]" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-6 w-40 rounded bg-[var(--color-bg)]" />
            <div className="h-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]" />
          </div>
        </div>
      )}

      {/* 404 Course Not Found State */}
      {!isLoading && isNotFound && (
        <div
          data-testid="course-not-found-state"
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center"
        >
          <div className="font-mono text-xs tracking-widest text-[var(--color-accent)] uppercase">
            404 Error
          </div>
          <h1 className="mt-3 text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl">
            Course Not Found
          </h1>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[var(--color-text-muted)] sm:text-sm">
            The course you are looking for may have been unpublished, moved, or does not
            exist.
          </p>
          <button
            type="button"
            data-testid="not-found-browse-btn"
            onClick={onBackToCourses}
            className="mt-6 rounded bg-[var(--color-accent)] px-5 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
          >
            Browse Available Courses
          </button>
        </div>
      )}

      {/* General Error State */}
      {!isLoading && !isNotFound && errorMessage && !course && (
        <div
          role="alert"
          data-testid="course-overview-error"
          className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center"
        >
          <h2 className="text-sm font-semibold text-red-400">
            Failed to load course details
          </h2>
          <p className="mt-2 text-xs text-red-300/80">{errorMessage}</p>
          <button
            type="button"
            data-testid="retry-course-overview-btn"
            onClick={handleRetry}
            className="mt-4 rounded bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Course Overview Content */}
      {!isLoading && !isNotFound && course && (
        <div className="space-y-10">
          {/* Hero Section */}
          <section
            data-testid="course-hero-section"
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-0.5 font-mono text-[11px] tracking-wider text-[var(--color-accent)] uppercase">
                {course.level}
              </span>
              <span className="rounded bg-[var(--color-bg)] px-2.5 py-0.5 font-mono text-[11px] text-[var(--color-text-muted)]">
                {course.isFree ? 'Free Curriculum' : 'Pro Course'}
              </span>
              {course.isEnrolled && (
                <span
                  data-testid="hero-enrolled-badge"
                  className="rounded border border-[var(--color-progress)]/30 bg-[var(--color-progress)]/10 px-2.5 py-0.5 font-mono text-[11px] text-[var(--color-progress)]"
                >
                  ✓ Enrolled
                </span>
              )}
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              {course.title}
            </h1>

            <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-muted)] sm:text-sm">
              {course.summary || course.description}
            </p>

            {/* Key Curriculum Metrics */}
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[var(--color-border)] pt-4 font-mono text-xs text-[var(--color-text-muted)]">
              <div>
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {course.modules.length}
                </span>{' '}
                {course.modules.length === 1 ? 'Module' : 'Modules'}
              </div>
              <span aria-hidden="true">•</span>
              <div>
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {totalLessonsCount}
                </span>{' '}
                {totalLessonsCount === 1 ? 'Lesson' : 'Lessons'}
              </div>
              {totalDurationMinutes > 0 && (
                <>
                  <span aria-hidden="true">•</span>
                  <div>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      ~{totalDurationMinutes}
                    </span>{' '}
                    min estimated
                  </div>
                </>
              )}
            </div>

            {/* Progress Bar (If Enrolled) */}
            {course.isEnrolled && progress && (
              <div
                data-testid="course-progress-container"
                className="mt-6 border-t border-[var(--color-border)] pt-4"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[var(--color-text-muted)]">
                    Your Course Progress
                  </span>
                  <span className="font-mono font-medium text-[var(--color-progress)]">
                    {progress.completedLessons} / {progress.totalLessons} completed (
                    {progress.percentage}%)
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--color-bg)]">
                  <div
                    data-testid="course-progress-bar"
                    className="h-full bg-[var(--color-progress)] transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Enrollment / Action CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {!isAuthenticated ? (
                <button
                  type="button"
                  data-testid="hero-signin-enroll-btn"
                  onClick={onRequireAuth}
                  className="rounded bg-[var(--color-accent)] px-5 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                >
                  Sign In to Enroll
                </button>
              ) : !course.isEnrolled ? (
                <button
                  type="button"
                  data-testid="hero-enroll-now-btn"
                  disabled={isEnrolling}
                  onClick={handleEnroll}
                  className="rounded bg-[var(--color-accent)] px-5 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none disabled:opacity-50"
                >
                  {isEnrolling ? 'Enrolling...' : 'Enroll in Course (Free)'}
                </button>
              ) : (
                <button
                  type="button"
                  data-testid="hero-continue-learning-btn"
                  onClick={handleStartLearning}
                  className="rounded bg-[var(--color-accent)] px-5 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
                >
                  {progress && progress.completedLessons > 0
                    ? 'Continue Learning'
                    : 'Start Learning'}
                </button>
              )}
            </div>

            {/* Learner Notice Alert */}
            {learnerNotice && (
              <div
                role="status"
                data-testid="learner-notice-banner"
                className="mt-4 rounded border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300"
              >
                {learnerNotice}
              </div>
            )}
          </section>

          {/* Curriculum Section */}
          <section aria-labelledby="curriculum-heading">
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="curriculum-heading"
                className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]"
              >
                Course Curriculum
              </h2>
              <span className="font-mono text-xs text-[var(--color-text-muted)]">
                {course.modules.length}{' '}
                {course.modules.length === 1 ? 'Module' : 'Modules'}
              </span>
            </div>

            <div data-testid="course-modules-list" className="space-y-4">
              {course.modules.map((mod, modIdx) => (
                <div
                  key={mod.id}
                  data-testid={`module-card-${mod.id}`}
                  className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
                >
                  {/* Module Header */}
                  <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]/40 px-5 py-3.5">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[var(--color-bg)] font-mono text-[11px] font-bold text-[var(--color-accent)]">
                        {String(modIdx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                          {mod.title}
                        </h3>
                        {mod.description && (
                          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                            {mod.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-[var(--color-text-muted)]">
                      {mod.lessons.length}{' '}
                      {mod.lessons.length === 1 ? 'lesson' : 'lessons'}
                    </span>
                  </div>

                  {/* Lessons List */}
                  <ul className="divide-y divide-[var(--color-border)]" role="list">
                    {mod.lessons.map((lesson) => {
                      const isCompleted =
                        progress?.completedLessonIds?.includes(lesson.id) ?? false;

                      return (
                        <li
                          key={lesson.id}
                          data-testid={`lesson-item-${lesson.id}`}
                          className={`flex flex-col justify-between gap-2 px-5 py-3 text-xs transition-colors hover:bg-[var(--color-bg)]/30 sm:flex-row sm:items-center ${
                            onNavigateLesson
                              ? 'cursor-pointer hover:text-[var(--color-accent)]'
                              : ''
                          }`}
                          onClick={() => onNavigateLesson?.(lesson.id)}
                          role={onNavigateLesson ? 'button' : undefined}
                          tabIndex={onNavigateLesson ? 0 : undefined}
                          onKeyDown={(e) => {
                            if (
                              onNavigateLesson &&
                              (e.key === 'Enter' || e.key === ' ')
                            ) {
                              e.preventDefault();
                              onNavigateLesson(lesson.id);
                            }
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            {isCompleted ? (
                              <span
                                aria-label="Completed"
                                className="font-bold text-[var(--color-progress)]"
                              >
                                ✓
                              </span>
                            ) : (
                              <span
                                aria-hidden="true"
                                className="font-mono text-[var(--color-text-muted)] opacity-60"
                              >
                                •
                              </span>
                            )}
                            <span className="font-medium text-[var(--color-text-primary)]">
                              {lesson.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 self-end font-mono text-[11px] sm:self-auto">
                            {lesson.estimatedMinutes && (
                              <span className="text-[var(--color-text-muted)]">
                                {lesson.estimatedMinutes} min
                              </span>
                            )}

                            {lesson.isPreview ? (
                              <span
                                data-testid={`preview-badge-${lesson.id}`}
                                className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-400"
                              >
                                Preview Available
                              </span>
                            ) : course.isEnrolled ? (
                              <span className="rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-0.5 text-[var(--color-text-muted)]">
                                Unlocked
                              </span>
                            ) : (
                              <span
                                data-testid={`locked-badge-${lesson.id}`}
                                className="flex items-center gap-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-0.5 text-[var(--color-text-muted)]"
                              >
                                <span aria-hidden="true">🔒</span>
                                <span>Enrolled only</span>
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
