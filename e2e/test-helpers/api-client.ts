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
import * as fs from 'fs';
import * as path from 'path';

// Token storage for authenticated requests
let accessToken: string | null = null;

// Load token from saved file (if exists)
function loadToken() {
  if (!accessToken) {
    try {
      const tokenFile = path.join(process.cwd(), '.auth', 'token.json');
      if (fs.existsSync(tokenFile)) {
        const tokenData = JSON.parse(fs.readFileSync(tokenFile, 'utf-8'));
        accessToken = tokenData.accessToken;
        console.log('🔑 API client loaded access token');
      }
    } catch (error) {
      console.warn('⚠️  Could not load access token:', error);
    }
  }
  return accessToken;
}

export function setApiToken(token: string) {
  accessToken = token;
}

// Create axios instance with base configuration
export const apiClient: AxiosInstance = axios.create({
  baseURL: testConfig.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 second timeout
});

// Request interceptor for logging and auth
apiClient.interceptors.request.use(
  (config) => {
    console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);
    
    // Load token if not already loaded
    loadToken();
    
    // Add Bearer token if available (from authenticated session)
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else if (testConfig.apiKey) {
      // Fallback to API key if no token
      config.headers['X-API-Key'] = testConfig.apiKey;
    }
    
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
