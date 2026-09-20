import React from 'react';
import { LessonContentBlock } from '@/services/api/lessons.service';

interface ListBlockProps {
  block: LessonContentBlock;
}

export const ListBlock: React.FC<ListBlockProps> = ({ block }) => {
  let isOrdered = false;
  if (block.metadata) {
    try {
      const parsed = JSON.parse(block.metadata);
      if (parsed.ordered === true) {
        isOrdered = true;
      }
    } catch {
      // Default to unordered
    }
  }

  let items: string[] = [];
  try {
    const parsed = JSON.parse(block.body);
    if (Array.isArray(parsed)) {
      items = parsed.map(String);
    }
  } catch {
    // Non-JSON format
  }

  if (items.length === 0) {
    items = block.body
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, ''));
  }

  if (isOrdered) {
    return (
      <ol
        data-testid={`list-block-${block.id}`}
        className="my-4 list-decimal space-y-1.5 pl-6 text-xs leading-relaxed text-[var(--color-text-primary)]/90 sm:text-sm"
      >
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ol>
    );
  }

  return (
    <ul
      data-testid={`list-block-${block.id}`}
      className="my-4 list-disc space-y-1.5 pl-6 text-xs leading-relaxed text-[var(--color-text-primary)]/90 sm:text-sm"
    >
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  );
};
