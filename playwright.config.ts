import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

/**
 * Playwright E2E Test Configuration
 * 
 * Configured for Dashboard UI testing with browser automation.
 * Tests interact with actual Next.js dashboard pages, forms, and tables.
 */
export default defineConfig({
  // Test directory
  testDir: './e2e',

  // Test timeout (5 minutes for UI interactions + API calls)
  timeout: 300000,

  // Expect timeout (30 seconds for UI elements)
  expect: {
    timeout: 30000,
  },

  // Test execution settings
  fullyParallel: false, // Run tests sequentially (UI state dependencies)
  forbidOnly: !!process.env.CI, // Fail CI if test.only is left in code
  retries: process.env.CI ? 2 : 1, // Retry failed UI tests (can be flaky)
  workers: 1, // Run tests one at a time (important for UI state)

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  // Shared settings for all tests
  use: {
    // Base URL for the dashboard
    baseURL: process.env.BRAID_BASE_URL || 'https://development.braid.zone',

    // Browser viewport
    viewport: { width: 1920, height: 1080 },

    // Test tracing (on first retry)
    trace: 'on-first-retry',

    // Screenshot settings (capture failures)
    screenshot: 'only-on-failure',

    // Video settings (retain failures for debugging)
    video: 'retain-on-failure',

    // Navigation timeout (30 seconds)
    navigationTimeout: 30000,

    // Action timeout (15 seconds for clicks, fills, etc.)
    actionTimeout: 15000,

    // Removed extraHTTPHeaders - was interfering with Cognito auth requests
  },

  // Test projects (browser configurations)
  projects: [
    // Setup project for authentication
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    // Main test project (requires auth)
    {
      name: 'chromium',
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        // Use authenticated state from setup
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Optional: Firefox browser testing
    // {
    //   name: 'firefox',
    //   testMatch: /.*\.spec\.ts/,
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     storageState: '.auth/user.json',
    //   },
    //   dependencies: ['setup'],
    // },

    // Optional: Safari browser testing
    // {
    //   name: 'webkit',
    //   testMatch: /.*\.spec\.ts/,
    //   use: {
    //     ...devices['Desktop Safari'],
    //     storageState: '.auth/user.json',
    //   },
    //   dependencies: ['setup'],
    // },
  ],

  // Web server configuration (if testing local dev server)
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  // },
});
