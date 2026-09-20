/**
 * DevLearn Centralized API Client
 * Provides type-safe HTTP methods and standardized error handling.
 */

export interface ApiClientConfig {
  baseUrl: string;
  timeoutMs?: number;
}

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly data?: unknown;

  constructor(message: string, status: number, data?: unknown, code?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.data = data;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(config?: Partial<ApiClientConfig>) {
    // If VITE_API_BASE_URL is configured, use it. Otherwise, default to empty string so
    // requests hit the Vite dev reverse-proxy at /api/v1
    const envBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
      /\/+$/,
      ''
    );
    this.baseUrl = config?.baseUrl ?? envBase ?? '';
  }

  private resolveUrl(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (!this.baseUrl) {
      return cleanPath;
    }
    return `${this.baseUrl}${cleanPath}`;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = this.resolveUrl(path);
    const headers = new Headers(options?.headers);

    if (!headers.has('Content-Type') && !(options?.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const response = await fetch(url, {
        credentials: options?.credentials ?? 'include',
        ...options,
        headers,
      });

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        const errorObj =
          data && typeof data === 'object' && 'error' in data
            ? (data as { error?: { code?: string; message?: string } }).error
            : undefined;

        const errorCode = errorObj?.code;
        const errorMessage =
          errorObj?.message ||
          (data &&
            typeof data === 'object' &&
            'message' in data &&
            (data as { message?: string }).message) ||
          `HTTP Error ${response.status}: ${response.statusText}`;

        throw new ApiClientError(errorMessage, response.status, data, errorCode);
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      throw new ApiClientError(
        (error as Error).message || 'Network communication failed',
        0
      );
    }
  }

  public get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  public post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
