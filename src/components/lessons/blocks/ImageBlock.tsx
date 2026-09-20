import React, { useState } from 'react';
import { LessonContentBlock } from '@/services/api/lessons.service';

interface ImageBlockProps {
  block: LessonContentBlock;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ block }) => {
  const [hasError, setHasError] = useState<boolean>(false);

  let alt = 'Lesson illustration';
  let caption: string | null = null;

  if (block.metadata) {
    try {
      const parsed = JSON.parse(block.metadata);
      if (parsed.alt) alt = parsed.alt;
      if (parsed.caption) caption = parsed.caption;
    } catch {
      // Default fallback
    }
  }

  if (hasError) {
    return (
      <div
        data-testid={`image-fallback-${block.id}`}
        className="my-5 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center text-xs text-[var(--color-text-muted)]"
      >
        <span aria-hidden="true">🖼️</span>
        <p className="mt-1 font-mono text-[11px]">{alt}</p>
        <p className="mt-0.5 text-[10px] opacity-75">(Image asset unavailable)</p>
      </div>
    );
  }

  return (
    <figure
      data-testid={`image-block-${block.id}`}
      className="my-6 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <img
        src={block.body}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        className="max-h-[450px] w-full object-contain p-2"
      />
      {caption && (
        <figcaption className="border-t border-[var(--color-border)] bg-[var(--color-bg)]/40 px-4 py-2 text-center font-mono text-[11px] text-[var(--color-text-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
