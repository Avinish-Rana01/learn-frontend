import React from 'react';
import { LessonContentBlock } from '@/services/api/lessons.service';

interface LinkBlockProps {
  block: LessonContentBlock;
}

export const LinkBlock: React.FC<LinkBlockProps> = ({ block }) => {
  let title = block.body;
  let description: string | null = null;

  if (block.metadata) {
    try {
      const parsed = JSON.parse(block.metadata);
      if (parsed.label || parsed.title) {
        title = parsed.label || parsed.title;
      }
      if (parsed.description) {
        description = parsed.description;
      }
    } catch {
      // Default to body
    }
  }

  const isExternal =
    block.body.startsWith('http://') || block.body.startsWith('https://');

  return (
    <div
      data-testid={`link-block-${block.id}`}
      className="my-3 inline-flex flex-col gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-xs transition-colors hover:border-[var(--color-accent)]"
    >
      <div className="flex items-center gap-2">
        <span className="font-mono text-[var(--color-accent)]" aria-hidden="true">
          &rarr;
        </span>
        <a
          href={block.body}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] hover:underline focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none"
        >
          {title}
        </a>
        {isExternal && (
          <span
            className="font-mono text-[10px] text-[var(--color-text-muted)]"
            aria-label="(opens in new tab)"
          >
            ↗
          </span>
        )}
      </div>
      {description && (
        <p className="pl-4 text-[11px] text-[var(--color-text-muted)]">{description}</p>
      )}
    </div>
  );
};
