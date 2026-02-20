/**
 * Test Configuration - Reads from Environment Variables
 * 
 * Required Environment Variables:
 * - BRAID_ENV: Environment name (development, staging, production)
 * - BRAID_BASE_URL: Base URL for Braid API
 * - BRAID_API_KEY: API key for authentication
 * - BRAID_PRODUCT_ID: Product ID to use for all test entities
 * - BRAID_TEST_USERNAME: Test user username (for dashboard login)
 * - BRAID_TEST_PASSWORD: Test user password (for dashboard login)
 * 
 * Setup: Create .env.local file with actual values (DO NOT COMMIT)
 */

import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

export interface TestConfig {
  environment: string;
  baseUrl: string; // Backward compatibility - same as dashboardUrl
  dashboardUrl: string;
  apiUrl: string;
  apiKey: string;
  username: string;
  password: string;
  productId: number;
  testDataGeneration: {
    useRealRoutingNumbers: boolean;
    useRealSwiftCodes: boolean;
    emailDomain: string;
  };
}

// For backward compatibility during migration
export const testConfig_legacy = {
  get baseUrl() {
    return testConfig.dashboardUrl;
  }
};

export const testConfig: TestConfig = {
  environment: process.env.BRAID_ENV || 'development',
  dashboardUrl: process.env.BRAID_DASHBOARD_URL || process.env.BRAID_BASE_URL!,
  baseUrl: process.env.BRAID_DASHBOARD_URL || process.env.BRAID_BASE_URL!, // Backward compatibility
  apiUrl: process.env.BRAID_API_URL || 'https://api.development.braid.zone',
  apiKey: process.env.BRAID_API_KEY!,
  username: process.env.BRAID_TEST_USERNAME || 'qagentuser1',
  password: process.env.BRAID_TEST_PASSWORD!,
  productId: parseInt(process.env.BRAID_PRODUCT_ID || '1069832'),
  testDataGeneration: {
    useRealRoutingNumbers: true,
    useRealSwiftCodes: true,
    emailDomain: 'devtest.braid.zone'
  }
};

// Backward compatibility alias
export const baseUrl = testConfig.dashboardUrl;

// Validate required configuration
const requiredEnvVars = [
  'BRAID_BASE_URL',
  'BRAID_API_KEY',
  'BRAID_PRODUCT_ID',
  'BRAID_TEST_PASSWORD'
];

const missingVars = requiredEnvVars.filter(
  varName => !process.env[varName]
);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}\n` +
    'Please create .env.local file with these variables.\n' +
    'See test-automation/agent-qa-plan.md for setup instructions.'
  );
}

// Log configuration (without secrets)
console.log('Test Configuration Loaded:');
console.log(`  Environment: ${testConfig.environment}`);
console.log(`  Dashboard URL: ${testConfig.dashboardUrl}`);
console.log(`  API URL: ${testConfig.apiUrl}`);
console.log(`  Product ID: ${testConfig.productId}`);
console.log(`  Username: ${testConfig.username}`);
console.log(`  API Key: ${testConfig.apiKey ? '✓ Loaded' : '✗ Missing'}`);
