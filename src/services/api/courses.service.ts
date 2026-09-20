import { apiClient } from './client';

export type ContentType =
  'HEADING' | 'TEXT' | 'CODE' | 'CALLOUT' | 'LIST' | 'IMAGE' | 'LINK';

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  level: string;
  isFree: boolean;
  moduleCount: number;
  lessonCount: number;
  isEnrolled?: boolean;
  createdAt: string;
}

export interface LessonSummary {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  orderIndex: number;
  isPreview: boolean;
  estimatedMinutes: number | null;
}

export interface ModuleDetail {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  lessons: LessonSummary[];
}

export interface CourseDetail {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  level: string;
  isFree: boolean;
  isEnrolled?: boolean;
  modules: ModuleDetail[];
}

export interface LessonContentBlock {
  id: string;
  contentType: ContentType;
  orderIndex: number;
  body: string;
  codeLanguage?: string | null;
  metadata?: string | null;
}

export interface QuizOption {
  id: string;
  text: string;
  orderIndex: number;
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: string;
  orderIndex: number;
  options: QuizOption[];
}

export interface QuizDetail {
  id: string;
  title: string;
  description: string | null;
  passingScore: number;
  questionCount: number;
  questions: QuizQuestion[];
}

export interface LessonDetail {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  orderIndex: number;
  isPreview: boolean;
  estimatedMinutes: number | null;
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
}

export interface QuizSubmission {
  answers: {
    questionId: string;
    optionId: string;
  }[];
}

export interface QuizResult {
  attemptId: string;
  score: number;
  passed: boolean;
  passingScore: number;
  totalQuestions: number;
  correctCount: number;
  submittedAt: string;
  results: {
    questionId: string;
    selectedOptionId: string | null;
    correctOptionId: string | null;
    isCorrect: boolean;
    explanation: string | null;
  }[];
}

export interface LessonProgressResult {
  lessonId: string;
  completed: boolean;
  completedAt: string | null;
}

export interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  completedLessonIds: string[];
}

/**
 * Fetch list of published courses.
 */
export async function getCourses(): Promise<CourseSummary[]> {
  const res = await apiClient.get<{
    success: boolean;
    data: { courses: CourseSummary[] };
  }>('/api/v1/courses');
  return res.data.courses;
}

/**
 * Fetch course syllabus and curriculum hierarchy by slug.
 */
export async function getCourseBySlug(slug: string): Promise<CourseDetail> {
  const res = await apiClient.get<{ success: boolean; data: { course: CourseDetail } }>(
    `/api/v1/courses/${slug}`
  );
  return res.data.course;
}

/**
 * Enroll user in course.
 */
export async function enrollInCourse(
  courseId: string
): Promise<{ id: string; courseId: string; status: string }> {
  const res = await apiClient.post<{
    success: boolean;
    data: { enrollment: { id: string; courseId: string; status: string } };
  }>(`/api/v1/courses/${courseId}/enroll`);
  return res.data.enrollment;
}

/**
 * Fetch lesson with ordered content blocks and quiz metadata.
 */
export async function getLesson(lessonId: string): Promise<LessonDetail> {
  const res = await apiClient.get<{ success: boolean; data: { lesson: LessonDetail } }>(
    `/api/v1/lessons/${lessonId}`
  );
  return res.data.lesson;
}

/**
 * Fetch learner-safe quiz questions (isCorrect omitted).
 */
export async function getQuiz(quizId: string): Promise<QuizDetail> {
  const res = await apiClient.get<{ success: boolean; data: { quiz: QuizDetail } }>(
    `/api/v1/quizzes/${quizId}`
  );
  return res.data.quiz;
}

/**
 * Submit quiz answers for server-side evaluation.
 */
export async function submitQuiz(
  quizId: string,
  submission: QuizSubmission
): Promise<QuizResult> {
  const res = await apiClient.post<{ success: boolean; data: { result: QuizResult } }>(
    `/api/v1/quizzes/${quizId}/submit`,
    submission
  );
  return res.data.result;
}

/**
 * Mark a lesson as completed or incomplete.
 */
export async function markLessonProgress(
  lessonId: string,
  completed = true
): Promise<LessonProgressResult> {
  const res = await apiClient.post<{
    success: boolean;
    data: { progress: LessonProgressResult };
  }>(`/api/v1/progress/lessons/${lessonId}`, { completed });
  return res.data.progress;
}

/**
 * Fetch derived completion percentage and completed lesson list for a course.
 */
export async function getCourseProgress(courseId: string): Promise<CourseProgress> {
  const res = await apiClient.get<{
    success: boolean;
    data: { progress: CourseProgress };
  }>(`/api/v1/progress/courses/${courseId}`);
  return res.data.progress;
}
