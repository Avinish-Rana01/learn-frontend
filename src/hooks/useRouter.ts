import { useState, useEffect, useCallback } from 'react';

export type RouteView =
  | 'home'
  | 'courses'
  | 'course-detail'
  | 'lesson'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'not-found';

export interface RouteState {
  path: string;
  view: RouteView;
  slug?: string;
  lessonId?: string;
}

export function parseRoute(pathname: string): RouteState {
  // Normalize trailing slash (unless root)
  const path =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (path === '' || path === '/') {
    return { path: '/', view: 'home' };
  }

  if (path === '/courses') {
    return { path: '/courses', view: 'courses' };
  }

  const courseMatch = path.match(/^\/courses\/([^/]+)$/);
  if (courseMatch) {
    return { path, view: 'course-detail', slug: courseMatch[1] };
  }

  const lessonMatch = path.match(/^\/(?:learn|lessons)\/([^/]+)$/);
  if (lessonMatch) {
    return { path, view: 'lesson', lessonId: lessonMatch[1] };
  }

  if (path === '/login') {
    return { path: '/login', view: 'login' };
  }

  if (path === '/register') {
    return { path: '/register', view: 'register' };
  }

  if (path === '/dashboard') {
    return { path: '/dashboard', view: 'dashboard' };
  }

  return { path, view: 'not-found' };
}

export function useRouter() {
  const [route, setRoute] = useState<RouteState>(() => {
    if (typeof window !== 'undefined') {
      return parseRoute(window.location.pathname);
    }
    return { path: '/', view: 'home' };
  });

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = useCallback((to: string, replace = false) => {
    if (typeof window !== 'undefined') {
      if (replace) {
        window.history.replaceState({}, '', to);
      } else {
        window.history.pushState({}, '', to);
      }
      setRoute(parseRoute(to));
    }
  }, []);

  return {
    ...route,
    navigate,
  };
}
