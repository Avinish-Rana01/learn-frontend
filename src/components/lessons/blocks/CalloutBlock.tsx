import React from 'react';
import { LessonContentBlock } from '@/services/api/lessons.service';

interface CalloutBlockProps {
  block: LessonContentBlock;
}

type CalloutVariant = 'tip' | 'info' | 'warning' | 'important';

export const CalloutBlock: React.FC<CalloutBlockProps> = ({ block }) => {
  let variant: CalloutVariant = 'info';
  let customTitle: string | null = null;

  if (block.metadata) {
    try {
      const parsed = JSON.parse(block.metadata);
      if (['tip', 'info', 'warning', 'important'].includes(parsed.variant)) {
        variant = parsed.variant;
      }
      if (parsed.title) {
        customTitle = parsed.title;
      }
    } catch {
      // Default to info
    }
  }

  const getVariantStyles = (v: CalloutVariant) => {
    switch (v) {
      case 'tip':
        return {
          border: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
          badge: 'bg-emerald-500/20 text-emerald-300',
          label: 'Tip',
        };
      case 'warning':
        return {
          border: 'border-amber-500/30 bg-amber-500/10 text-amber-200',
          badge: 'bg-amber-500/20 text-amber-300',
          label: 'Warning',
        };
      case 'important':
        return {
          border: 'border-rose-500/30 bg-rose-500/10 text-rose-200',
          badge: 'bg-rose-500/20 text-rose-300',
          label: 'Important',
        };
      case 'info':
      default:
        return {
          border:
            'border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-text-primary)]',
          badge: 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]',
          label: 'Note',
        };
    }
  };

  const styles = getVariantStyles(variant);

  return (
    <aside
      data-testid={`callout-block-${block.id}`}
      className={`my-5 rounded-lg border p-4 text-xs sm:text-sm ${styles.border}`}
    >
      <div className="mb-1.5 flex items-center gap-2 font-mono text-[11px] font-semibold tracking-wider uppercase">
        <span className={`rounded px-1.5 py-0.5 ${styles.badge}`}>
          {customTitle || styles.label}
        </span>
      </div>
      <p className="leading-relaxed opacity-90">{block.body}</p>
    </aside>
  );
};
