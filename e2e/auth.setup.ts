/**
 * Authentication Setup
 * 
 * This file runs ONCE before all tests to:
 * 1. Log into the dashboard with test credentials
 * 2. Save the authenticated session state
 * 3. Reuse that state for all subsequent tests
 * 
 * This avoids logging in for every single test (much faster).
 */

import { test as setup } from '@playwright/test';
import { testConfig } from './test-helpers/config';
import * as fs from 'fs';
import * as path from 'path';

const authFile = path.join(__dirname, '..', '.auth', 'user.json');

setup('authenticate', async ({ page }) => {
  console.log('\n🔐 Authenticating to Braid Dashboard...');
  console.log(`📍 Dashboard URL: ${testConfig.baseUrl}`);
  console.log(`👤 Username: ${testConfig.username}\n`);

  // Navigate to dashboard (will redirect to login if not authenticated)
  await page.goto(testConfig.baseUrl);

  // Wait for AWS Amplify Authenticator login form
  await page.waitForSelector('input[name="username"]', { timeout: 30000 });

  // Fill in login credentials
  await page.fill('input[name="username"]', testConfig.username);
  await page.fill('input[name="password"]', testConfig.password);

  // Click sign in button
  await page.click('button[type="submit"]');

  // Wait for successful login (dashboard should load)
  // Look for the drawer/sidebar which appears after authentication
  await page.waitForSelector('[role="navigation"]', { timeout: 60000 });

  console.log('✅ Authentication successful!');
  console.log('💾 Saving session state to .auth/user.json\n');

  // Create .auth directory if it doesn't exist
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Save signed-in state to reuse in all tests
  await page.context().storageState({ path: authFile });

  console.log('🎉 Setup complete! Tests can now run with authenticated session.\n');
});
