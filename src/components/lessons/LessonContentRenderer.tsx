import React from 'react';
import { LessonContentBlock } from '@/services/api/lessons.service';
import { HeadingBlock } from './blocks/HeadingBlock';
import { TextBlock } from './blocks/TextBlock';
import { CodeBlock } from './blocks/CodeBlock';
import { CalloutBlock } from './blocks/CalloutBlock';
import { ListBlock } from './blocks/ListBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { LinkBlock } from './blocks/LinkBlock';

interface LessonContentRendererProps {
  contents: LessonContentBlock[];
}

export const LessonContentRenderer: React.FC<LessonContentRendererProps> = ({
  contents,
}) => {
  if (!contents || contents.length === 0) {
    return (
      <div
        data-testid="empty-lesson-content"
        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center text-xs text-[var(--color-text-muted)]"
      >
        This lesson has no content blocks yet.
      </div>
    );
  }

  // Sort deterministically by canonical orderIndex
  const sortedBlocks = [...contents].sort((a, b) => a.orderIndex - b.orderIndex);

  const renderBlock = (block: LessonContentBlock) => {
    switch (block.contentType?.toUpperCase()) {
      case 'HEADING':
        return <HeadingBlock key={block.id} block={block} />;
      case 'TEXT':
        return <TextBlock key={block.id} block={block} />;
      case 'CODE':
        return <CodeBlock key={block.id} block={block} />;
      case 'CALLOUT':
        return <CalloutBlock key={block.id} block={block} />;
      case 'LIST':
        return <ListBlock key={block.id} block={block} />;
      case 'IMAGE':
        return <ImageBlock key={block.id} block={block} />;
      case 'LINK':
        return <LinkBlock key={block.id} block={block} />;
      default:
        console.warn(
          `[LessonContentRenderer] Unsupported block type: ${block.contentType}`
        );
        return (
          <div
            key={block.id}
            data-testid={`unknown-block-${block.id}`}
            className="my-3 rounded border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-xs text-[var(--color-text-muted)]"
          >
            <span className="font-mono font-semibold">[{block.contentType}]</span>{' '}
            <span>
              Unsupported lesson content block. This type is not supported in the current
              renderer version.
            </span>
          </div>
        );
    }
  };

  return (
    <article
      data-testid="lesson-content-renderer"
      className="prose-devlearn max-w-none text-left"
    >
      {sortedBlocks.map(renderBlock)}
    </article>
  );
};
