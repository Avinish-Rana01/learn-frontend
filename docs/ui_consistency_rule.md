# Frontend UI Consistency Rule: Charcoal & Orange Direction

> **Target**: `frontend/`  
> **Status**: Mandatory design rule for all screens, layouts, components, and responsive views.

---

## 1. Product Aesthetic: The DevLearn Direction
The frontend must provide a quiet, distraction-free environment for serious technical education. The user experience is modeled directly on the approved **DevLearn** visual identity:

- **Primary Canvas**: Matte charcoal dark theme (`#212121`).
- **Elevated Surfaces**: Dark gray (`#2B2B2B` to `#383838`) with crisp, thin borders (`#4A4A4A`).
- **Primary Action**: Warm orange (`#E67E22`) for CTAs, active sidebar tabs, and focus indicators.
- **Success & Progress**: Restrained muted green (`#2ECC71` / `#38A169`).
- **Clean Documentation Style**: Deeply inspired by high-quality developer documentation (MDN, Stripe, Tailwind docs).

---

## 2. Visual Hierarchy Rules
| Priority | Element | Visual Treatment | Example |
| :--- | :--- | :--- | :--- |
| **1. Context** | Page Title / Breadcrumb | High contrast, bold sans-serif | `Creating your first repository` |
| **2. Primary Action** | Main CTA | Warm orange background, white bold text | `Continue learning`, `Next lesson ->` |
| **3. Core Content** | Lesson prose, Code, Quiz | Generous line height (1.6), readable column | Markdown prose, formatted code blocks |
| **4. Supporting** | Table of Contents, Resources | Subdued text (`#B0B0B0`), left border indicator | `On this page`, `Git cheat sheet` |
| **5. Secondary** | Auxiliary links, quotes | Small muted text, bottom alignment | `Small steps build real progress.` |

---

## 3. Responsive Navigation Models

### Desktop View:
- **Left Sidebar**: Fixed, compact, text-first navigation.
  - DevLearn logo: `<>` orange icon + `DevLearn` brand text.
  - Items: `My Learning` (active with orange text & orange left bar), `Browse Courses`, `Practice`, `Notes`, `Goals`, `Settings`, `Help`.
- **Lesson View**:
  - Breadcrumb at top: `Course > Module > Lesson`.
  - Main article column (~720px wide).
  - Clean code snippets with line numbers and copy action.
  - Right sidebar: "On this page" TOC and "Related resources".
  - Footer navigation: `<- Previous` (subtle border button) and `Next lesson ->` (orange button).

### Mobile View:
- **Top Header**: Logo + hamburger menu.
- **Bottom Navigation Bar**: Fixed bottom bar with icons and text labels (`My Learning`, `Browse`, `Practice`, `Notes`).
- **Cards & Rows**: Full-width stacked buttons and clean divider-separated rows.

---

## 4. Semantic Design Tokens (`tokens.css`)

```css
:root {
  /* Dark Mode (Default) */
  --color-bg: #212121;
  --color-surface: #2B2B2B;
  --color-surface-hover: #383838;
  --color-border: #4A4A4A;
  --color-text-primary: #F2F2F2;
  --color-text-muted: #B0B0B0;
  --color-accent: #E67E22;
  --color-accent-hover: #D35400;
  --color-progress: #2ECC71;
  --color-progress-track: #3A3A3A;
  --color-code-bg: #1A1A1A;
  --color-code-border: #333333;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
}

[data-theme="light"] {
  --color-bg: #F8F9FA;
  --color-surface: #FFFFFF;
  --color-surface-hover: #F1F3F5;
  --color-border: #E2E8F0;
  --color-text-primary: #1A202C;
  --color-text-muted: #64748B;
  --color-accent: #E67E22;
  --color-accent-hover: #D35400;
  --color-progress: #2ECC71;
  --color-progress-track: #E2E8F0;
  --color-code-bg: #F1F5F9;
  --color-code-border: #CBD5E1;
}
```

---

## 5. Explicitly Banned Patterns
- ❌ Glassmorphism / Frosted backdrop blurs
- ❌ Gradients on buttons, cards, or page backgrounds
- ❌ Neon greens, cyans, or vibrant purples
- ❌ Decorative 3D illustrations or floating shapes
- ❌ Over-rounded pill layouts for non-tag elements
- ❌ Fake analytics cards with unnecessary graphs
- ❌ Decorative or distracting animations
