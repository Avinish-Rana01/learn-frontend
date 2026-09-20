import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LessonContentRenderer } from './LessonContentRenderer';
import { LessonContentBlock } from '@/services/api/lessons.service';

describe('LessonContentRenderer Engine', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders HEADING blocks with semantic h2 or h3', () => {
    const contents: LessonContentBlock[] = [
      {
        id: 'b-1',
        contentType: 'HEADING',
        orderIndex: 1,
        body: 'Core VCS Principles',
        metadata: JSON.stringify({ level: 2 }),
      },
      {
        id: 'b-2',
        contentType: 'HEADING',
        orderIndex: 2,
        body: 'Sub-topic Details',
        metadata: JSON.stringify({ level: 3 }),
      },
    ];

    render(<LessonContentRenderer contents={contents} />);

    const h2 = screen.getByRole('heading', { level: 2 });
    expect(h2).toBeDefined();
    expect(h2.textContent).toBe('Core VCS Principles');

    const h3 = screen.getByRole('heading', { level: 3 });
    expect(h3).toBeDefined();
    expect(h3.textContent).toBe('Sub-topic Details');
  });

  it('renders TEXT blocks with comfortable multi-paragraph line spacing', () => {
    const contents: LessonContentBlock[] = [
      {
        id: 'b-1',
        contentType: 'TEXT',
        orderIndex: 1,
        body: 'First paragraph explaining Git concepts.\n\nSecond paragraph delving deeper into trees.',
      },
    ];

    render(<LessonContentRenderer contents={contents} />);

    expect(screen.getByText('First paragraph explaining Git concepts.')).toBeDefined();
    expect(screen.getByText('Second paragraph delving deeper into trees.')).toBeDefined();
  });

  it('renders CODE block with language badge, code content, and copies to clipboard', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const contents: LessonContentBlock[] = [
      {
        id: 'b-1',
        contentType: 'CODE',
        orderIndex: 1,
        body: 'git init\ngit status',
        codeLanguage: 'bash',
      },
    ];

    render(<LessonContentRenderer contents={contents} />);

    expect(screen.getByText('BASH')).toBeDefined();
    expect(screen.getByText(/git status/)).toBeDefined();

    const copyBtn = screen.getByTestId('copy-code-btn-b-1');
    expect(copyBtn).toBeDefined();
    expect(copyBtn.textContent).toContain('Copy');

    fireEvent.click(copyBtn);
    expect(writeTextMock).toHaveBeenCalledWith('git init\ngit status');

    await waitFor(() => {
      expect(copyBtn.textContent).toContain('Copied ✓');
    });
  });

  it('renders CALLOUT blocks with appropriate variant styles and icons', () => {
    const contents: LessonContentBlock[] = [
      {
        id: 'b-1',
        contentType: 'CALLOUT',
        orderIndex: 1,
        body: 'Always check git status before committing.',
        metadata: JSON.stringify({ title: 'Pro Tip', variant: 'tip' }),
      },
      {
        id: 'b-2',
        contentType: 'CALLOUT',
        orderIndex: 2,
        body: 'Force pushing can overwrite remote history.',
        metadata: JSON.stringify({ title: 'Caution', variant: 'warning' }),
      },
    ];

    render(<LessonContentRenderer contents={contents} />);

    expect(screen.getByText('Pro Tip')).toBeDefined();
    expect(screen.getByText('Always check git status before committing.')).toBeDefined();
    expect(screen.getByText('Caution')).toBeDefined();
    expect(screen.getByText('Force pushing can overwrite remote history.')).toBeDefined();
  });

  it('renders LIST blocks as semantic unordered and ordered lists', () => {
    const contents: LessonContentBlock[] = [
      {
        id: 'b-1',
        contentType: 'LIST',
        orderIndex: 1,
        body: JSON.stringify(['Working Directory', 'Staging Area', 'Git Repository']),
        metadata: JSON.stringify({ ordered: false }),
      },
      {
        id: 'b-2',
        contentType: 'LIST',
        orderIndex: 2,
        body: JSON.stringify(['Step 1: Init', 'Step 2: Add', 'Step 3: Commit']),
        metadata: JSON.stringify({ ordered: true }),
      },
    ];

    render(<LessonContentRenderer contents={contents} />);

    expect(screen.getByText('Working Directory')).toBeDefined();
    expect(screen.getByText('Staging Area')).toBeDefined();
    expect(screen.getByText('Step 1: Init')).toBeDefined();
    expect(screen.getByText('Step 3: Commit')).toBeDefined();
  });

  it('renders IMAGE block with alt text, caption, and broken asset fallback', () => {
    const contents: LessonContentBlock[] = [
      {
        id: 'b-1',
        contentType: 'IMAGE',
        orderIndex: 1,
        body: 'https://images.unsplash.com/photo-git-flow.png',
        metadata: JSON.stringify({
          alt: 'Git Three Trees Diagram',
          caption: 'Figure 1.1: The Three Trees of Git',
        }),
      },
    ];

    render(<LessonContentRenderer contents={contents} />);

    const img = screen.getByRole('img');
    expect(img).toBeDefined();
    expect(img.getAttribute('alt')).toBe('Git Three Trees Diagram');
    expect(screen.getByText('Figure 1.1: The Three Trees of Git')).toBeDefined();

    // Trigger image error to test fallback
    fireEvent.error(img);
    expect(screen.getByTestId('image-fallback-b-1')).toBeDefined();
  });

  it('renders LINK block with accessible label and secure external attributes', () => {
    const contents: LessonContentBlock[] = [
      {
        id: 'b-1',
        contentType: 'LINK',
        orderIndex: 1,
        body: 'https://git-scm.com/doc',
        metadata: JSON.stringify({
          label: 'Official Git Documentation',
          description: 'Reference manual for all Git commands',
        }),
      },
    ];

    render(<LessonContentRenderer contents={contents} />);

    const link = screen.getByRole('link');
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('https://git-scm.com/doc');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(screen.getByText('Official Git Documentation')).toBeDefined();
    expect(screen.getByText('Reference manual for all Git commands')).toBeDefined();
  });

  it('handles unknown/future content types gracefully without crashing', () => {
    const contents: LessonContentBlock[] = [
      {
        id: 'b-unknown',
        contentType:
          'FUTURE_INTERACTIVE_WIDGET' as unknown as LessonContentBlock['contentType'],
        orderIndex: 1,
        body: 'interactive widget payload',
      },
    ];

    render(<LessonContentRenderer contents={contents} />);

    expect(screen.getByTestId('unknown-block-b-unknown')).toBeDefined();
    expect(screen.getByText(/Unsupported lesson content block/)).toBeDefined();
  });

  it('renders empty content state when no blocks are provided', () => {
    render(<LessonContentRenderer contents={[]} />);

    expect(screen.getByTestId('empty-lesson-content')).toBeDefined();
    expect(screen.getByText(/This lesson has no content blocks yet/)).toBeDefined();
  });
});
