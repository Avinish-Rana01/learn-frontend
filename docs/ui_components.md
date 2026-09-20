# Frontend UI Components & Learner Experience

## 1. Design Aesthetics
- **Theme**: Premium developer-centric dark palette (Slate-950 background, Indigo/Violet accents, emerald progress indicators).
- **Typography**: Crisp typography with monospace syntax highlighting for code snippets.
- **Micro-Interactions**: Smooth transitions, progress completion rings, celebratory confetti upon passing quizzes or completing courses.

## 2. Key Component Hierarchy
1. **Application Shell**:
   - `AppHeader`: Logo, navigation links, course search trigger, user avatar with active session badge, logout button.
   - `InstallPromptBanner`: PWA installation callout for compatible browsers.
2. **Catalog & Course Overview**:
   - `CourseCard`: Thumbnail, level badge, estimated hours, syllabus count, progress bar if enrolled.
   - `CourseDetailHeader`: Overview, enroll/resume action button, instructor bio.
   - `SyllabusTree`: Collapsible modules with preview tags on free lessons.
3. **Immersive Learning Player (`/learn/:courseSlug/:lessonId`)**:
   - `PlayerSidebar`: Sticky navigation with completed checkmarks and current lesson highlight.
   - `LessonContent`: Markdown renderer supporting headers, lists, admonition callouts, and interactive code blocks with copy-to-clipboard.
   - `LessonFooter`: "Mark as Completed", "Next Lesson", "Take Quiz" buttons.
4. **Quiz Runner (`/quiz/:quizId`)**:
   - `QuizHeader`: Timer, question pagination dots.
   - `QuestionCard`: Multi-choice / single-choice options with keyboard navigation.
   - `ResultModal`: Score percentage, pass/fail badge, detailed question review with explanations.
