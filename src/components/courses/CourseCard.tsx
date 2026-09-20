import React from 'react';
import { CourseSummary } from '@/services/api/courses.service';

interface CourseCardProps {
  course: CourseSummary;
  isAuthenticated?: boolean;
  onSelect: (slug: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isAuthenticated = false,
  onSelect,
}) => {
  const getActionText = () => {
    if (!isAuthenticated) {
      return 'View Course';
    }
    if (course.isEnrolled) {
      return 'Continue Learning';
    }
    return 'Get Started';
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level.toUpperCase()) {
      case 'BEGINNER':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'INTERMEDIATE':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'ADVANCED':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-[var(--color-text-muted)] bg-[var(--color-bg)] border-[var(--color-border)]';
    }
  };

  return (
    <article
      data-testid={`course-card-${course.slug}`}
      className="group flex flex-col justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all focus-within:ring-2 focus-within:ring-[var(--color-accent)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--color-bg)] hover:border-[var(--color-accent)]/80"
    >
      <div>
        {/* Header Metadata */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-[11px] font-medium tracking-wider uppercase ${getLevelBadgeClass(
              course.level
            )}`}
          >
            {course.level}
          </span>
          <div className="flex items-center gap-2">
            {course.isEnrolled && (
              <span
                data-testid={`enrolled-badge-${course.slug}`}
                className="inline-flex items-center rounded border border-[var(--color-progress)]/30 bg-[var(--color-progress)]/10 px-2 py-0.5 font-mono text-[10px] font-medium text-[var(--color-progress)]"
              >
                Enrolled
              </span>
            )}
            <span className="rounded bg-[var(--color-bg)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-text-muted)]">
              {course.isFree ? 'Free' : 'Pro'}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-lg font-semibold tracking-tight text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent)]">
          {course.title}
        </h3>

        {/* Summary */}
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[var(--color-text-muted)]">
          {course.summary ||
            course.description ||
            'Comprehensive developer learning curriculum.'}
        </p>
      </div>

      <div className="mt-6 border-t border-[var(--color-border)] pt-4">
        {/* Stats and Action */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs text-[var(--color-text-muted)]">
            <span>
              {course.moduleCount} {course.moduleCount === 1 ? 'Module' : 'Modules'}
            </span>
            <span aria-hidden="true">•</span>
            <span>
              {course.lessonCount} {course.lessonCount === 1 ? 'Lesson' : 'Lessons'}
            </span>
          </div>

          <button
            type="button"
            data-testid={`course-action-btn-${course.slug}`}
            onClick={() => onSelect(course.slug)}
            className={`rounded px-3.5 py-1.5 text-xs font-semibold transition-all focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-1 focus:ring-offset-[var(--color-bg)] focus:outline-none ${
              course.isEnrolled
                ? 'bg-[var(--color-accent)] text-white hover:opacity-90'
                : 'border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'
            }`}
          >
            {getActionText()}
          </button>
        </div>
      </div>
    </article>
  );
};
