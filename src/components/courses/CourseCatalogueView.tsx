import React, { useEffect, useState, useCallback } from 'react';
import { getCourses, CourseSummary } from '@/services/api/courses.service';
import { ApiClientError } from '@/services/api/client';
import { CourseCard } from './CourseCard';

interface CourseCatalogueViewProps {
  isAuthenticated?: boolean;
  onSelectCourse: (slug: string) => void;
}

export const CourseCatalogueView: React.FC<CourseCatalogueViewProps> = ({
  isAuthenticated = false,
  onSelectCourse,
}) => {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    getCourses()
      .then((data) => {
        if (isMounted) {
          setCourses(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          if (err instanceof ApiClientError) {
            setErrorMessage(err.message || 'Failed to load courses.');
          } else {
            setErrorMessage('Unable to connect to course services. Please try again.');
          }
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setErrorMessage(null);
    setRetryCount((prev) => prev + 1);
  }, []);

  return (
    <div className="w-full">
      {/* Catalogue Header */}
      <header className="mb-8">
        <div className="mb-2 inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 font-mono text-[11px] text-[var(--color-accent)]">
          Developer Curriculum
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
          Explore Courses
        </h1>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[var(--color-text-muted)] sm:text-sm">
          Hands-on technical courses designed for focused developers. Learn version
          control, backend architecture, and database engineering from first principles.
        </p>
      </header>

      {/* Loading Skeleton */}
      {isLoading && (
        <div
          data-testid="courses-loading-skeleton"
          aria-busy="true"
          aria-label="Loading available courses"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
            >
              <div className="flex justify-between">
                <div className="h-4 w-16 rounded bg-[var(--color-bg)]" />
                <div className="h-4 w-10 rounded bg-[var(--color-bg)]" />
              </div>
              <div className="mt-4 h-6 w-3/4 rounded bg-[var(--color-bg)]" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full rounded bg-[var(--color-bg)]" />
                <div className="h-3 w-5/6 rounded bg-[var(--color-bg)]" />
              </div>
              <div className="mt-6 flex justify-between border-t border-[var(--color-border)] pt-4">
                <div className="h-4 w-24 rounded bg-[var(--color-bg)]" />
                <div className="h-6 w-20 rounded bg-[var(--color-bg)]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && errorMessage && (
        <div
          role="alert"
          data-testid="courses-error-state"
          className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center"
        >
          <h2 className="text-sm font-semibold text-red-400">
            Failed to load course catalogue
          </h2>
          <p className="mt-2 text-xs text-red-300/80">{errorMessage}</p>
          <button
            type="button"
            data-testid="retry-courses-btn"
            onClick={handleRetry}
            className="mt-4 rounded bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
          >
            Retry Loading Courses
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !errorMessage && courses.length === 0 && (
        <div
          data-testid="courses-empty-state"
          className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] py-12 text-center"
        >
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
            No courses available yet
          </h2>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            We are preparing new curriculum modules. Check back soon!
          </p>
        </div>
      )}

      {/* Course Cards Grid */}
      {!isLoading && !errorMessage && courses.length > 0 && (
        <section
          aria-label="Courses list"
          data-testid="courses-grid"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isAuthenticated={isAuthenticated}
              onSelect={onSelectCourse}
            />
          ))}
        </section>
      )}
    </div>
  );
};
