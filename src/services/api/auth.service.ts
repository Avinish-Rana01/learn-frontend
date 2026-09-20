import { apiClient } from './client';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    session?: { id: string; expiresAt: string };
    tokens?: { accessToken: string; refreshToken: string };
  };
}

export interface UserResponse {
  success: boolean;
  data: {
    user: User;
  };
}

/**
 * Register a new user account.
 */
export async function register(data: RegisterData): Promise<User> {
  const res = await apiClient.post<AuthResponse>('/api/v1/auth/register', data);
  return res.data.user;
}

/**
 * Log in with email and password.
 * Enforces single active session on the backend.
 */
export async function login(credentials: LoginCredentials): Promise<User> {
  const res = await apiClient.post<AuthResponse>('/api/v1/auth/login', credentials);
  return res.data.user;
}

/**
 * Log out and invalidate the current session in the backend.
 */
export async function logout(): Promise<void> {
  await apiClient.post('/api/v1/auth/logout');
}

/**
 * Fetch the currently authenticated user.
 */
export async function getMe(): Promise<User> {
  const res = await apiClient.get<UserResponse>('/api/v1/auth/me');
  return res.data.user;
}
