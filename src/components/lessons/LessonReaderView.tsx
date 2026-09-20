import React, { useEffect, useState, useCallback } from 'react';
import {
  getLesson,
  markLessonComplete,
  LessonDetail,
} from '@/services/api/lessons.service';
import { ApiClientError } from '@/services/api/client';
import { LessonContentRenderer } from './LessonContentRenderer';

interface LessonReaderViewProps {
  lessonId: string;
  isAuthenticated?: boolean;
  onNavigateLesson: (targetLessonId: string) => void;
  onNavigateCourse: (courseSlug: string) => void;
  onNavigateCourses: () => void;
  onRequireAuth: () => void;
}

export const LessonReaderView: React.FC<LessonReaderViewProps> = ({
  lessonId,
  isAuthenticated = false,
  onNavigateLesson,
  onNavigateCourse,
  onNavigateCourses,
  onRequireAuth,
}) => {
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState<boolean>(false);
  const [progressError, setProgressError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'instant' });
      } catch {
        // Safe fallback in test environments
      }
    }

    getLesson(lessonId)
      .then((data) => {
        if (!isMounted) return;
        setLesson(data);
        setIsCompleted(data.isCompleted ?? false);
        setErrorStatus(null);
        setErrorMessage(null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err instanceof ApiClientError) {
          setErrorStatus(err.status);
          setErrorMessage(err.message || 'Unable to access lesson.');
        } else {
          setErrorStatus(500);
          setErrorMessage('Unable to connect to lesson service.');
        }
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [lessonId, retryCount]);

  const handleToggleComplete = async () => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    if (!lesson || isUpdatingProgress) return;

    setIsUpdatingProgress(true);
    setProgressError(null);
    const newStatus = !isCompleted;
    try {
      await markLessonComplete(lesson.id, newStatus);
      setIsCompleted(newStatus);
      // Update local syllabus state for checkmark display
      if (lesson.syllabus) {
        const updatedSyllabus = lesson.syllabus.map((mod) => ({
          ...mod,
          lessons: mod.lessons.map((l) =>
            l.id === lesson.id ? { ...l, isCompleted: newStatus } : l
          ),
        }));
        setLesson((prev) => (prev ? { ...prev, syllabus: updatedSyllabus } : prev));
      }
    } catch (err) {
      if (err instanceof ApiClientError) {
        setProgressError(err.message || 'Failed to update lesson progress.');
      } else {
        setProgressError('Failed to update lesson progress.');
      }
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setErrorMessage(null);
    setErrorStatus(null);
    setRetryCount((prev) => prev + 1);
  }, []);

  return (
    <div className="w-full">
      {/* Loading Skeleton */}
      {isLoading && (
        <div
          data-testid="lesson-reader-loading"
          data-skeleton="true"
          aria-busy="true"
          aria-label="Loading lesson content"
          className="mx-auto max-w-4xl animate-pulse space-y-6 py-6"
        >
          <div className="h-4 w-48 rounded bg-[var(--color-surface)]" />
          <div className="h-8 w-3/4 rounded bg-[var(--color-surface)]" />
          <div className="h-4 w-1/4 rounded bg-[var(--color-surface)]" />
          <div className="mt-8 space-y-3">
            <div className="h-4 w-full rounded bg-[var(--color-surface)]" />
            <div className="h-4 w-5/6 rounded bg-[var(--color-surface)]" />
            <div className="h-4 w-4/6 rounded bg-[var(--color-surface)]" />
          </div>
          <div className="h-48 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]" />
        </div>
      )}

      {/* 401 Authentication Error State */}
      {!isLoading && errorStatus === 401 && (
        <div
          data-testid="lesson-auth-error"
          className="mx-auto max-w-lg rounded-lg border border-amber-500/30 bg-amber-500/10 p-8 text-center"
        >
          <div className="font-mono text-xs tracking-wider text-amber-400 uppercase">
            Sign In Required
          </div>
          <h2 className="mt-2 text-xl font-bold text-[var(--color-text-primary)]">
            Authentication Required
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-amber-200/90">
            This lesson is protected. Please sign in to your DevLearn account to continue
            learning.
          </p>
          <button
            type="button"
            data-testid="auth-redirect-btn"
            onClick={onRequireAuth}
            className="mt-6 rounded bg-[var(--color-accent)] px-5 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Sign In to DevLearn
          </button>
        </div>
      )}

      {/* 403 Enrollment Required State */}
      {!isLoading && errorStatus === 403 && (
        <div
          data-testid="lesson-forbidden-error"
          className="mx-auto max-w-lg rounded-lg border border-rose-500/30 bg-rose-500/10 p-8 text-center"
        >
          <div className="font-mono text-xs tracking-wider text-rose-400 uppercase">
            Enrollment Required
          </div>
          <h2 className="mt-2 text-xl font-bold text-[var(--color-text-primary)]">
            Course Access Required
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-rose-200/90">
            This is a protected lesson. Please enroll in the course to unlock the full
            curriculum.
          </p>
          <button
            type="button"
            data-testid="forbidden-return-btn"
            onClick={onNavigateCourses}
            className="mt-6 rounded bg-[var(--color-accent)] px-5 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Return to Courses
          </button>
        </div>
      )}

      {/* 404 Lesson Not Found State */}
      {!isLoading && errorStatus === 404 && (
        <div
          data-testid="lesson-not-found-error"
          className="mx-auto max-w-lg rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center"
        >
          <div className="font-mono text-xs tracking-wider text-[var(--color-accent)] uppercase">
            404
          </div>
          <h2 className="mt-2 text-xl font-bold text-[var(--color-text-primary)]">
            Lesson Not Found
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
            The lesson you requested does not exist or has been removed.
          </p>
          <button
            type="button"
            data-testid="not-found-return-btn"
            onClick={onNavigateCourses}
            className="mt-6 rounded bg-[var(--color-accent)] px-5 py-2.5 text-xs font-semibold text-white"
          >
            Browse Course Catalogue
          </button>
        </div>
      )}

      {/* General Error State */}
      {!isLoading && errorStatus && ![401, 403, 404].includes(errorStatus) && (
        <div
          role="alert"
          data-testid="lesson-general-error"
          className="mx-auto max-w-lg rounded-lg border border-red-500/30 bg-red-500/10 p-8 text-center"
        >
          <h2 className="text-sm font-semibold text-red-400">Failed to load lesson</h2>
          <p className="mt-2 text-xs text-red-300/80">{errorMessage}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-4 rounded bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Main Lesson Reader Interface */}
      {!isLoading && !errorStatus && lesson && (
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          {/* Mobile Curriculum Toggle */}
          <div className="mb-2 w-full lg:hidden">
            <button
              type="button"
              data-testid="mobile-curriculum-toggle"
              onClick={() => setIsSidebarOpenMobile((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-xs font-medium text-[var(--color-text-primary)]"
            >
              <span>Course Curriculum Outline</span>
              <span className="font-mono text-[var(--color-accent)]">
                {isSidebarOpenMobile ? '▲ Hide' : '▼ View'}
              </span>
            </button>
          </div>

          {/* Desktop & Mobile Sidebar */}
          <aside
            data-testid="lesson-sidebar"
            className={`w-full shrink-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all lg:w-72 ${
              isSidebarOpenMobile ? 'block' : 'hidden lg:block'
            } max-h-[calc(100vh-6rem)] overflow-y-auto lg:sticky lg:top-4`}
          >
            <div className="mb-4 border-b border-[var(--color-border)] pb-3">
              <button
                type="button"
                data-testid="sidebar-course-link"
                onClick={() => onNavigateCourse(lesson.course?.slug || '')}
                className="text-left text-xs font-semibold text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent)]"
              >
                {lesson.course?.title || 'Course'}
              </button>
              <div className="mt-1 font-mono text-[10px] text-[var(--color-text-muted)]">
                Course Syllabus
              </div>
            </div>

            {/* Modules Outline */}
            <div className="space-y-4">
              {lesson.syllabus?.map((mod, modIdx) => (
                <div key={mod.id} className="space-y-1">
                  <div className="flex items-center gap-1.5 px-2 font-mono text-[11px] font-semibold text-[var(--color-text-muted)]">
                    <span className="text-[var(--color-accent)]">
                      {String(modIdx + 1).padStart(2, '0')}.
                    </span>
                    <span className="truncate">{mod.title}</span>
                  </div>
                  <ul className="mt-1 space-y-0.5" role="list">
                    {mod.lessons.map((l) => {
                      const isCurrent = l.id === lesson.id;
                      return (
                        <li key={l.id}>
                          <button
                            type="button"
                            data-testid={`sidebar-lesson-${l.id}`}
                            onClick={() => {
                              setIsSidebarOpenMobile(false);
                              if (l.id !== lesson.id) {
                                onNavigateLesson(l.id);
                              }
                            }}
                            className={`flex w-full items-center justify-between gap-2 rounded px-2.5 py-1.5 text-left text-xs transition-colors ${
                              isCurrent
                                ? 'bg-[var(--color-accent)]/10 font-semibold text-[var(--color-accent)]'
                                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]/50 hover:text-[var(--color-text-primary)]'
                            }`}
                          >
                            <span className="truncate">{l.title}</span>
                            <div className="flex shrink-0 items-center gap-1 font-mono text-[10px]">
                              {l.isCompleted ? (
                                <span className="font-bold text-[var(--color-progress)]">
                                  ✓
                                </span>
                              ) : isCurrent ? (
                                <span className="text-[var(--color-accent)]">●</span>
                              ) : (
                                <span className="opacity-40">○</span>
                              )}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="max-w-3xl min-w-0 flex-1">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-[var(--color-text-muted)]">
                <li>
                  <button
                    type="button"
                    onClick={onNavigateCourses}
                    className="hover:text-[var(--color-accent)] hover:underline focus:outline-none"
                  >
                    Courses
                  </button>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <button
                    type="button"
                    data-testid="breadcrumb-course"
                    onClick={() => onNavigateCourse(lesson.course?.slug || '')}
                    className="max-w-[150px] truncate hover:text-[var(--color-accent)] hover:underline focus:outline-none sm:max-w-none"
                  >
                    {lesson.course?.title || 'Course'}
                  </button>
                </li>
                <li aria-hidden="true">/</li>
                <li
                  data-testid="breadcrumb-module"
                  className="max-w-[120px] truncate font-medium text-[var(--color-text-primary)] sm:max-w-none"
                >
                  {lesson.module?.title || 'Module'}
                </li>
                <li aria-hidden="true">/</li>
                <li
                  data-testid="breadcrumb-lesson"
                  className="max-w-[120px] truncate font-medium text-[var(--color-text-primary)] sm:max-w-none"
                >
                  {lesson.title}
                </li>
              </ol>
            </nav>

            {/* Lesson Header */}
            <header className="mb-6 border-b border-[var(--color-border)] pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-[var(--color-surface)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-accent)]">
                  {lesson.module?.title || 'Module'}
                </span>
                {lesson.isPreview && (
                  <span
                    data-testid="lesson-preview-tag"
                    className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400"
                  >
                    Preview Available
                  </span>
                )}
                {isCompleted && (
                  <span
                    data-testid="completed-badge"
                    className="rounded border border-[var(--color-progress)]/30 bg-[var(--color-progress)]/10 px-2 py-0.5 font-mono text-[10px] text-[var(--color-progress)]"
                  >
                    Completed ✓
                  </span>
                )}
              </div>

              <h1
                data-testid="lesson-title"
                className="mt-3 text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl"
              >
                {lesson.title}
              </h1>

              {lesson.estimatedMinutes && (
                <div className="mt-2 font-mono text-xs text-[var(--color-text-muted)]">
                  ~{lesson.estimatedMinutes} min read
                </div>
              )}
            </header>

            {/* Lesson Structured Content */}
            <section aria-label="Lesson Body" className="mb-10">
              <LessonContentRenderer contents={lesson.contents} />
            </section>

            {/* Checkpoint Quiz Placeholder Card */}
            {lesson.quiz && (
              <section
                data-testid="lesson-checkpoint-quiz-card"
                className="my-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-mono text-xs font-semibold text-[var(--color-accent)]">
                    Lesson Checkpoint Quiz
                  </div>
                  <span className="rounded bg-[var(--color-bg)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-text-muted)]">
                    Step 7 Assessment Engine
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-[var(--color-text-primary)]">
                  {lesson.quiz.title}
                </h3>
                {lesson.quiz.description && (
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    {lesson.quiz.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between font-mono text-xs text-[var(--color-text-muted)]">
                  <span>Passing score: {lesson.quiz.passingScore}%</span>
                  <span className="font-medium text-[var(--color-accent)]">
                    Ready in Step 7
                  </span>
                </div>
              </section>
            )}

            {/* Bottom Footer Navigation Bar */}
            <footer className="border-t border-[var(--color-border)] pt-6">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                {/* Mark Complete Button & Error notice */}
                <div className="flex flex-col items-start gap-1">
                  <button
                    type="button"
                    data-testid="mark-complete-btn"
                    disabled={isUpdatingProgress}
                    onClick={handleToggleComplete}
                    className={`rounded px-4 py-2 text-xs font-semibold transition-all focus:ring-2 focus:ring-[var(--color-progress)] focus:outline-none ${
                      isCompleted
                        ? 'border border-[var(--color-progress)]/40 bg-[var(--color-progress)]/10 text-[var(--color-progress)] hover:bg-[var(--color-progress)]/20'
                        : 'bg-[var(--color-accent)] text-white hover:opacity-90'
                    }`}
                  >
                    {isUpdatingProgress
                      ? 'Updating...'
                      : isCompleted
                        ? 'Completed ✓'
                        : 'Mark Complete'}
                  </button>
                  {progressError && (
                    <div
                      role="alert"
                      data-testid="progress-error-banner"
                      className="mt-1 text-xs text-red-400"
                    >
                      {progressError}
                    </div>
                  )}
                </div>

                {/* Previous & Next Navigation Controls */}
                <div className="flex items-center justify-between gap-3 self-stretch sm:justify-end sm:self-auto">
                  {lesson.navigation?.previousLesson ? (
                    <button
                      type="button"
                      data-testid="prev-lesson-btn"
                      onClick={() =>
                        onNavigateLesson(lesson.navigation!.previousLesson!.id)
                      }
                      className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-xs font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                    >
                      &larr; Previous Lesson
                    </button>
                  ) : (
                    <span className="font-mono text-[11px] text-[var(--color-text-muted)] opacity-60">
                      Start of Course
                    </span>
                  )}

                  {lesson.navigation?.nextLesson ? (
                    <button
                      type="button"
                      data-testid="next-lesson-btn"
                      onClick={() => onNavigateLesson(lesson.navigation!.nextLesson!.id)}
                      className="rounded bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Next Lesson &rarr;
                    </button>
                  ) : (
                    <div
                      data-testid="course-completion-boundary"
                      className="flex flex-wrap items-center gap-2"
                    >
                      <span className="text-xs text-[var(--color-text-muted)]">
                        You&apos;ve reached the end of this course section.
                      </span>
                      <button
                        type="button"
                        data-testid="course-finish-btn"
                        onClick={() => onNavigateCourse(lesson.course?.slug || '')}
                        className="rounded border border-[var(--color-progress)]/40 bg-[var(--color-progress)]/10 px-3.5 py-2 text-xs font-medium text-[var(--color-progress)]"
                      >
                        Course Overview &rarr;
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </footer>
          </main>
        </div>
      )}
    </div>
  );
};
