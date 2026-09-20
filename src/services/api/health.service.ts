import { apiClient } from './client';

export interface HealthResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
  database?: 'connected' | 'disconnected';
}

/**
 * Fetch health status of the DevLearn backend service.
 */
export async function getHealthStatus(): Promise<HealthResponse> {
  return apiClient.get<HealthResponse>('/api/v1/health');
}
