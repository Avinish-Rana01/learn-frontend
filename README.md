# 🚀 Learn Platform - Frontend (PWA)

> Production-grade, installable Progressive Web Application (PWA) built for the **Developer Learning Platform**.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat&logo=pwa&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📖 1. Product Vision & UX Philosophy

The **Learn Frontend** delivers a modern, high-performance learning interface for technical subjects such as Git/GitHub, SQL, Node.js, and React.

- **Responsive Multi-Device Layout**: Tailored for desktop monitors, laptops, tablets, and mobile smartphones.
- **Installable PWA**: Runs as a standalone desktop and mobile application with custom app manifests and service worker caching.
- **Rich Technical Learning Experience**:
  - Immersive lesson player with split-pane navigation.
  - Formatted Markdown rendering with syntax-highlighted code blocks.
  - Interactive quiz runner with instant score calculation and review explanations.
  - Real-time learner progress tracking with celebratory completion micro-interactions.
- **Zero Hardcoded Learning Material**: All courses, modules, lessons, and quiz questions are dynamic data driven by the backend API.

---

## 🛠️ 2. Technology Stack

| Layer           | Technology                      | Details                                                                    |
| :-------------- | :------------------------------ | :------------------------------------------------------------------------- |
| **Framework**   | **React 19 + TypeScript**       | Strict type safety, functional components, custom hooks                    |
| **Build Tool**  | **Vite**                        | Lightning-fast Hot Module Replacement (HMR) and optimized ESM output       |
| **Routing**     | **React Router**                | Client-side routing with protected learner routes                          |
| **PWA Engine**  | **Vite Plugin PWA**             | Web app manifest generation and Workbox service worker                     |
| **Icons**       | **Lucide React**                | Clean, lightweight, consistent SVG developer icon set                      |
| **Styling**     | **Modern CSS / Design Tokens**  | Sleek dark-mode developer palette (Slate-950, Indigo/Violet accents)       |
| **HTTP Client** | **Fetch / Axios Service Layer** | Centralized API client with interceptors for auth and session invalidation |

---

## 🔒 3. Single Active Session Handling

The backend strictly enforces **one active authenticated session per user account**. The frontend seamlessly handles this security constraint:

1. When a learner logs into their account from **Device B**, the backend invalidates the session for **Device A**.
2. Upon **Device A's** next API request or token refresh, the backend returns:
   ```json
   {
     "success": false,
     "error": {
       "code": "SESSION_INVALIDATED_BY_NEW_LOGIN",
       "message": "Your account was logged in from another device. Please log in again."
     }
   }
   ```
3. The frontend's global API interceptor catches this response code, clears local user state, and displays a user-friendly **Session Expired Modal** directing the user back to the login screen without crashing the application.

---

## 📱 4. PWA Caching & Entitlement Safety

The Progressive Web App operates under strict **entitlement protection guidelines**:

- **Precached Assets**:
  - Application shell (HTML, JavaScript bundles, CSS stylesheets, fonts, brand logos).
- **Runtime API Caching**:
  - Public course catalog metadata is cached using a network-first strategy.
- **Protected Course Gating**:
  - Protected lesson content and quiz assessments are **never cached indefinitely offline** to prevent unauthorized access or entitlement bypass.
  - Client state and user cache are immediately purged upon logout or session invalidation.

---

## 📁 5. Project Directory Structure

```text
learn-frontend/
├── docs/                     # Architectural specifications and design guides
│   ├── pwa_offline.md        # Service worker rules and manifest configuration
│   ├── ui_components.md      # UI components hierarchy and theme tokens
│   ├── routing_and_state.md  # Client-side routes and session management
│   └── api_contracts.md      # Shared /api/v1 communication models
├── public/                   # Static assets, PWA icons, favicon
│   ├── favicon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   └── manifest.webmanifest
├── src/
│   ├── assets/               # Branding graphics and illustrations
│   ├── components/           # Reusable UI primitives
│   │   ├── common/           # Buttons, Cards, Modals, ProgressBars, Badges
│   │   ├── layout/           # AppHeader, Sidebar, NavigationDrawer, Footer
│   │   └── code/             # CodeBlock with syntax highlighting and copy button
│   ├── features/             # Domain feature slices
│   │   ├── auth/             # Login, Register, SessionExpiredModal
│   │   ├── catalog/          # CourseCatalog, FilterBar, CourseCard
│   │   ├── course-detail/    # SyllabusOverview, ModuleAccordion, EnrollCTA
│   │   ├── learning/         # LessonPlayer, MarkdownRenderer, MarkCompleteButton
│   │   └── quiz/             # QuizRunner, OptionList, ScoreSummaryModal
│   ├── services/             # API client methods with response interceptors
│   ├── context/              # AuthContext and LearningProgressContext
│   ├── types/                # TypeScript models (Course, Lesson, Quiz, User)
│   ├── App.tsx               # Route definitions and context providers
│   ├── main.tsx              # Application bootstrap
│   └── index.css             # Design tokens, CSS variables, and global resets
├── vite.config.ts            # Vite build setup with VitePWA plugin
├── tsconfig.json             # TypeScript compiler settings
└── package.json              # Project dependencies and scripts
```

---

## 🚀 6. Getting Started

### Prerequisites

- **Node.js**: v22.0.0 or higher (Node 22 LTS recommended)
- **pnpm**: v10.0.0 or higher

### Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/Avinish-Rana01/learn-frontend.git
cd learn-frontend

# 2. Install dependencies
pnpm install

# 3. Start local development server
pnpm dev
```

The application will be live at `http://localhost:5173`.

### Available Scripts

- `pnpm dev`: Start local Vite development server
- `pnpm build`: Build production bundle and generate PWA assets
- `pnpm preview`: Preview production build locally
- `pnpm lint`: Run ESLint checks with accessibility rules
- `pnpm typecheck`: Run TypeScript compiler typecheck (`tsc --noEmit`)
- `pnpm test`: Run Vitest unit & component test suite
- `pnpm format`: Format all code with Prettier
- `pnpm format:check`: Verify formatting consistency with Prettier

---

## 🔗 7. Backend API Companion

This frontend is designed to integrate with the **Learn Platform Backend API**:

- **Repository**: [https://github.com/Avinish-Rana01/learn-backend](https://github.com/Avinish-Rana01/learn-backend)
- **API Version**: `/api/v1`
- **Default Port**: `http://localhost:4000`

---

## 📄 8. Documentation Index

For detailed architectural and design specifications, refer to the [`docs/`](./docs) folder:

- [Frontend UI Consistency Rule (Charcoal & Orange)](./docs/ui_consistency_rule.md)
- [PWA & Offline Architecture](./docs/pwa_offline.md)
- [UI Components & UX Design](./docs/ui_components.md)
- [Routing & State Architecture](./docs/routing_and_state.md)
- [API Communication Contracts](./docs/api_contracts.md)

---

## 📜 9. License

This project is licensed under the MIT License.
