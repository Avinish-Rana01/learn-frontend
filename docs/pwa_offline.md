# Progressive Web App (PWA) & Offline Architecture

## 1. PWA Goals

1. Installable on desktop (Chrome, Edge, Safari) and mobile (Android, iOS).
2. Fast first-load experience via precached application shell.
3. Offline handling that protects course entitlement integrity (no offline entitlement leaks).

## 2. Web App Manifest (`manifest.webmanifest`)

- **name**: "Learn - Developer Education Platform"
- **short_name**: "Learn"
- **theme_color**: `#0f172a` (slate-900)
- **background_color**: `#020617` (slate-950)
- **display**: `standalone`
- **start_url**: `/`
- **icons**:
  - 192x192 PNG (standard)
  - 512x512 PNG (standard & splash)
  - 512x512 maskable PNG (Android adaptive icon)

## 3. Service Worker & Caching Strategy

- **Precache**:
  - HTML entry point, compiled JS bundles, CSS files, fonts, and brand assets.
- **Runtime Caching**:
  - API Course Catalog: Network-first with short cache fallback for browsing metadata.
  - Protected Lesson Content: **Network-only or strictly verified cache**.
- **Entitlement Protection Rule**:
  - Service worker MUST NOT serve protected course content when the user is logged out or when their session has expired.
  - On logout or `SESSION_INVALIDATED_BY_NEW_LOGIN`, client caches for user-specific data are purged.
