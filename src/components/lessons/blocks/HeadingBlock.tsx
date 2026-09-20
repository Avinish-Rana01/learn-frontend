import React from 'react';
import { LessonContentBlock } from '@/services/api/lessons.service';

interface HeadingBlockProps {
  block: LessonContentBlock;
}

export const HeadingBlock: React.FC<HeadingBlockProps> = ({ block }) => {
  let level = 2;
  if (block.metadata) {
    try {
      const parsed = JSON.parse(block.metadata);
      if (parsed.level === 3 || parsed.level === 4) {
        level = parsed.level;
      }
    } catch {
      // Default to h2
    }
  }

  if (level === 3) {
    return (
      <h3
        data-testid={`heading-block-${block.id}`}
        className="mt-6 mb-2 text-base font-semibold tracking-tight text-[var(--color-text-primary)]"
      >
        {block.body}
      </h3>
    );
  }

  return (
    <h2
      data-testid={`heading-block-${block.id}`}
      className="mt-8 mb-3 text-xl font-bold tracking-tight text-[var(--color-text-primary)] first:mt-0"
    >
      {block.body}
    </h2>
  );
};
