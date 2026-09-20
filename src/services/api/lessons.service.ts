import { apiClient } from './client';
import { LessonContentBlock, ContentType } from './courses.service';

export type { LessonContentBlock, ContentType };

export interface LessonNavigationItem {
  id: string;
  slug: string;
  title: string;
  orderIndex: number;
}

export interface SyllabusLessonItem {
  id: string;
  title: string;
  slug: string;
  orderIndex: number;
  isPreview: boolean;
  estimatedMinutes: number | null;
  isCompleted?: boolean;
}

export interface SyllabusModuleItem {
  id: string;
  title: string;
  orderIndex: number;
  lessons: SyllabusLessonItem[];
}

export interface LessonDetail {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  orderIndex: number;
  isPreview: boolean;
  estimatedMinutes: number | null;
  isCompleted?: boolean;
  course: {
    id: string;
    slug: string;
    title: string;
  };
  module: {
    id: string;
    title: string;
  };
  contents: LessonContentBlock[];
  quiz: {
    id: string;
    title: string;
    description: string | null;
    passingScore: number;
  } | null;
  navigation?: {
    previousLesson: LessonNavigationItem | null;
    nextLesson: LessonNavigationItem | null;
  };
  syllabus?: SyllabusModuleItem[];
}

export interface LessonProgressResult {
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
}

/**
 * Fetch lesson by ID including ordered content blocks, navigation, and syllabus progress.
 */
export async function getLesson(lessonId: string): Promise<LessonDetail> {
  const res = await apiClient.get<{ success: boolean; data: { lesson: LessonDetail } }>(
    `/api/v1/lessons/${lessonId}`
  );
  return res.data.lesson;
}

/**
 * Mark a lesson as completed or incomplete.
 */
export async function markLessonComplete(
  lessonId: string,
  completed = true
): Promise<LessonProgressResult> {
  const res = await apiClient.post<{
    success: boolean;
    data: { progress: LessonProgressResult };
  }>(`/api/v1/lessons/${lessonId}/progress`, { completed });
  return res.data.progress;
}
