# System Architecture & Multi-Client Strategy

## 1. High-Level Architecture

```text
+-------------------------------------------------------------+
|                        Clients                              |
|   +-----------------------+     +-----------------------+   |
|   |   React + Vite PWA    |     |  Future Flutter App   |   |
|   |   (Desktop/Tablet/Mob)|     |  (iOS & Android)      |   |
|   +-----------+-----------+     +-----------+-----------+   |
+---------------|-----------------------------|---------------+
                |                             |
                | HTTPS (JSON REST API v1)    | HTTPS (JSON REST API v1)
                | Cookie or Bearer Token      | Bearer Token
                v                             v
+-------------------------------------------------------------+
|                      Backend API Gateway                    |
|   - Rate Limiter (Auth & Sensitive Routes)                  |
|   - CORS Configuration (Supports Web & Mobile origins)      |
|   - Session & JWT Validator (Single active session check)   |
|   - Input Validation Layer (Zod DTO schemas)                |
+-------------------------------------------------------------+
|                      Domain Services                        |
|   - Auth & Session Service                                  |
|   - Course & Lesson Access Control Service                  |
|   - Quiz Grading & Assessment Engine                        |
|   - Learner Progress Tracker                                |
+-------------------------------------------------------------+
|                      Data & Storage Layer                   |
|   - PostgreSQL (Relational DB, source of truth)             |
|   - Migrations & Seed Scripts                               |
|   - Embedded PGlite fallback for zero-friction local dev    |
+-------------------------------------------------------------+
```

## 2. Multi-Client Compatibility Matrix

| Requirement              | Web PWA                                                                       | Future Flutter Mobile                                                   |
| :----------------------- | :---------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| **Auth Transport**       | `HttpOnly` Secure Cookie (primary) + Bearer token header                      | `Authorization: Bearer <token>` in header                               |
| **Session Invalidation** | React global response interceptor redirects to login on `SESSION_INVALIDATED` | Dio/HTTP interceptor redirects to login screen on `SESSION_INVALIDATED` |
| **Offline Behavior**     | Service worker caches static UI shell and layout assets                       | Local app bundle contains UI code natively                              |
| **Data Gating**          | Un-enrolled content blocked by backend 403 Forbidden                          | Un-enrolled content blocked by backend 403 Forbidden                    |
| **API Format**           | Standard JSON `/api/v1/...`                                                   | Standard JSON `/api/v1/...`                                             |

## 3. Shared Data Contracts

All responses conform to a unified envelope:

### Success Response:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response:

```json
{
  "success": false,
  "error": {
    "code": "SESSION_INVALIDATED_BY_NEW_LOGIN",
    "message": "Your account was logged in from another device. Please log in again."
  }
}
```
