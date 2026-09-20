import React from 'react';
import { LessonContentBlock } from '@/services/api/lessons.service';

interface TextBlockProps {
  block: LessonContentBlock;
}

export const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
  // Split paragraphs by double newline
  const paragraphs = block.body.split(/\n\n+/).filter((p) => p.trim().length > 0);

  return (
    <div data-testid={`text-block-${block.id}`} className="mb-5 space-y-3">
      {paragraphs.map((p, idx) => (
        <p
          key={idx}
          className="text-sm leading-relaxed text-[var(--color-text-primary)]/90"
        >
          {p}
        </p>
      ))}
    </div>
  );
};
