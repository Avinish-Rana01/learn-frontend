# Frontend Architectural Plan & Specification

## 1. Overview
The frontend is a modern, responsive, installable Progressive Web Application (PWA) built with React, TypeScript, and Vite. It serves as the primary learner portal for discovering, reading, practicing, and completing technical courses.

## 2. Technology Choices
- **Build Tool**: Vite (fast HMR, optimized ESM bundle)
- **UI Framework**: React 19+ / React 18 with TypeScript
- **Routing**: React Router (DOM)
- **Styling**: Modern dark-mode responsive design system (Tailwind CSS or clean modular CSS tokens)
- **Icons**: Lucide React
- **PWA Tooling**: `vite-plugin-pwa` with Service Worker precaching of shell assets
- **Typography**: Clean monospace fonts for code blocks, Inter/system font for readable prose

## 3. Directory Structure (Proposed for Implementation)
```text
frontend/
├── public/                   # PWA icons (192, 512, maskable), manifest, favicon
├── src/
│   ├── assets/               # Brand logos, illustrations
│   ├── components/           # Reusable UI components
│   │   ├── layout/           # AppHeader, Sidebar, Footer, Container
│   │   ├── common/           # Button, Card, Badge, Modal, ProgressBar, Alert
│   │   └── code/             # SyntaxHighlighter, CodeSandbox/Snippet view
│   ├── features/             # Feature slices
│   │   ├── auth/             # Login, Register, SessionExpiredModal
│   │   ├── catalog/          # CourseGrid, CourseCard, Filters
│   │   ├── course-detail/    # SyllabusView, EnrollButton, InstructorCard
│   │   ├── learning/         # LessonReader, ModuleNavigation, CompletionButton
│   │   └── quiz/             # QuizRunner, QuestionCard, ScoreSummary
│   ├── services/             # API HTTP client (Axios/Fetch with interceptor)
│   ├── context/ or store/    # AuthContext, ThemeContext, ActiveCourseContext
│   ├── types/                # TypeScript interfaces & API models
│   ├── App.tsx               # Root routes & providers
│   ├── main.tsx              # React mounting
│   └── index.css             # Design tokens, variables, typography
├── vite.config.ts            # Vite + PWA manifest config
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```
