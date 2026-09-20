import React, { useState, useCallback } from 'react';
import { LessonContentBlock } from '@/services/api/lessons.service';

interface CodeBlockProps {
  block: LessonContentBlock;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ block }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(block.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments where navigator.clipboard is unavailable
      const textArea = document.createElement('textarea');
      textArea.value = block.body;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Ignore copy failure
      }
      document.body.removeChild(textArea);
    }
  }, [block.body]);

  const language = block.codeLanguage?.toUpperCase() || 'CODE';

  return (
    <div
      data-testid={`code-block-${block.id}`}
      className="my-5 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-code-bg)]"
    >
      {/* Code Header Bar */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/50 px-4 py-2 font-mono text-[11px]">
        <span className="font-medium text-[var(--color-text-muted)]">{language}</span>
        <button
          type="button"
          data-testid={`copy-code-btn-${block.id}`}
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="inline-flex items-center gap-1.5 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 text-[11px] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] focus:outline-none"
        >
          {copied ? (
            <span className="font-semibold text-[var(--color-progress)]">Copied ✓</span>
          ) : (
            <span>Copy</span>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[var(--color-text-primary)] sm:text-sm">
        <code>{block.body}</code>
      </pre>
    </div>
  );
};
