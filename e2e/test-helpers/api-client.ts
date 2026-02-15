/**
 * API Client for E2E Tests
 * 
 * Configured with:
 * - Base URL from environment variables
 * - API Key authentication in headers
 * - Request/response interceptors for logging
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { testConfig } from './config';

// Create axios instance with base configuration
export const apiClient: AxiosInstance = axios.create({
  baseURL: testConfig.baseUrl,
  headers: {
    'X-API-Key': testConfig.apiKey,
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 second timeout
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`← ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error(
        `← ${error.response.status} ${error.config?.url}`,
        error.response.data
      );
    } else {
      console.error('Response Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Helper function to check if API is accessible
 */
export async function verifyApiAccess(): Promise<boolean> {
  try {
    // Try to hit a simple endpoint to verify connectivity
    // Adjust endpoint based on your API
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('API Access Verification Failed:', error);
    return false;
  }
}

export default apiClient;
