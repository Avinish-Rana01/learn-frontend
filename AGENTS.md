# Frontend UI Consistency Guidelines & Constraints

This rule applies to every component, screen, layout, modal, and responsive view inside `frontend/`.

## 1. Visual Reference & Style

- Follow the approved **DevLearn charcoal-and-orange** visual direction.
- Theme: Dark charcoal/gray interface (`#212121`), elevated surfaces (`#2B2B2B`), thin borders (`#4A4A4A`), warm orange for primary action/active states (`#E67E22`), and muted restrained green (`#2ECC71` / `#38A169`) exclusively for progress and completion.
- Never use glassmorphism, blur effects, color gradients, floating blobs, 3D graphics, or decorative animations.

## 2. Visual Hierarchy

1. Page title / learning context
2. Primary learner action ("Continue learning", "Next lesson ->")
3. Main content (lesson prose, code blocks, quiz question, course rows)
4. Supporting navigation & metadata (sidebar, table of contents, resources)
5. Low-priority metadata

## 3. Typography & Code Presentation

- Interface: Modern clean sans-serif font.
- Code & commands: Monospace font with dark container (`#1A1A1A`), line numbers, copy button, and horizontal scrolling on mobile.
- Documentation-style lesson reader: comfortable readable width (~720px), concise right-hand table of contents, clear previous/next buttons.

## 4. Components & Layout

- Desktop: Left persistent compact sidebar with text labels and warm orange active indicator.
- Mobile: Clean header + fixed bottom navigation bar with simple icon+label tabs.
- Radii: 6px to 8px (`rounded-md`).
- Avoid wrapping every item in a card; use simple border-separated list rows.
- Support both Dark Mode and Light Mode via CSS variables. Never hard-code raw colors in components.
