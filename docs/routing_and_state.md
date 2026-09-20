# Routing, State Management & Session Lifecycle

## 1. Route Map
| Route | Access Level | Description |
| :--- | :--- | :--- |
| `/` | Public | Hero landing, feature showcase, highlighted courses |
| `/courses` | Public | Full course catalog with filters (level, topic) |
| `/courses/:slug` | Public | Course syllabus, overview, enroll CTA, preview lessons |
| `/learn/:courseSlug/:lessonId` | Protected | Interactive lesson reader with progress update |
| `/quiz/:quizId` | Protected | Interactive assessment and grading runner |
| `/my-courses` | Protected | Learner dashboard with enrollments and progress |
| `/login` | Guest Only | User authentication form |
| `/register` | Guest Only | New learner onboarding |

## 2. Global State Architecture
- `AuthContext`:
  - `user`: Current authenticated user profile or null.
  - `isAuthenticated`: Boolean.
  - `isLoading`: Initial token / session verification loading state.
  - `login(credentials)`: Authenticates and updates active session.
  - `logout()`: Calls backend invalidation and clears client state.
- `SessionInvalidatedModal`:
  - Triggers automatically when any API request receives `401 Unauthorized` with code `SESSION_INVALIDATED_BY_NEW_LOGIN`.
  - Informs the user: *"Your account was logged in from another device. For security, you have been logged out on this device."*
  - Provides a single "Log in again" action button.

## 3. API Client Interceptors
- Handles automatic Bearer header inclusion when cookies are not in use (e.g. mobile or cross-origin).
- Intercepts 401 errors globally to clear auth state and display the session expiration dialog without crashing the view.
