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

  // Capture console errors and warnings for debugging
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      console.log(`[Browser ${msg.type()}]:`, msg.text());
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    console.log('[Page Error]:', error.message);
  });

  // Navigate to dashboard (will redirect to login if not authenticated)
  await page.goto(testConfig.dashboardUrl);

  // Wait for AWS Amplify Authenticator login form
  await page.waitForSelector('input[name="username"]', { timeout: 30000 });

  // Wait for Amplify to fully initialize
  // Amplify's auth state machine needs time to set up event handlers
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Fill in login credentials
  await page.fill('input[name="username"]', testConfig.username.trim());
  await page.fill('input[name="password"]', testConfig.password.trim());

  console.log('📝 Form filled, clicking sign in...');

  // Click sign in button
  await page.click('button[type="submit"]');

  console.log('⏳ Waiting for navigation or error alert...');
  
  // Wait a moment to see if error appears
  await page.waitForTimeout(2000);
  
  // Check if error alert is present
  const errorAlert = await page.locator('text=An error occurred during the sign in process').isVisible();
  if (errorAlert) {
    const errorText = await page.locator('text=An error occurred during the sign in process').textContent();
    console.log('❌ Error alert found:', errorText);
    throw new Error(`Authentication failed: ${errorText}`);
  }

  console.log('✓ No error alert, waiting for dashboard...');

  // Wait for successful login - dashboard loads with drawer/sidebar
  // Look for any link in the navigation (e.g., "Dashboard", "Individuals", "Accounts")
  await page.waitForSelector('a[href="/"]', { timeout: 60000 });
  
  console.log('✅ Authentication successful!');
  console.log('💾 Saving session state to .auth/user.json\n');

  // Debug: Check what's in localStorage and sessionStorage
  const localStorageData = await page.evaluate(() => JSON.stringify(localStorage));
  const sessionStorageData = await page.evaluate(() => JSON.stringify(sessionStorage));
  console.log('📦 LocalStorage:', localStorageData.substring(0, 200));
  console.log('📦 SessionStorage:', sessionStorageData.substring(0, 200));

  // Create .auth directory if it doesn't exist
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Playwright's storageState() doesn't save sessionStorage!
  // We need to manually extract and save sessionStorage for Amplify auth
  const sessionStorage = await page.evaluate(() => {
    const data: Record<string, string> = {};
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i);
      if (key) {
        data[key] = window.sessionStorage.getItem(key) || '';
      }
    }
    return data;
  });

  // Save storageState with sessionStorage included
  const storageState = await page.context().storageState();
  const fullState = {
    ...storageState,
    origins: [
      ...(storageState.origins || []),
      {
        origin: testConfig.dashboardUrl,
        localStorage: [],
        sessionStorage: Object.entries(sessionStorage).map(([name, value]) => ({ name, value }))
      }
    ]
  };
  
  fs.writeFileSync(authFile, JSON.stringify(fullState, null, 2));
  console.log('✅ Saved session state with sessionStorage for Amplify auth');

  // Extract Cognito access token from session storage for API calls
  const sessionData = await page.evaluate(() => {
    // Amplify stores tokens in sessionStorage with keys like:
    // CognitoIdentityServiceProvider.{clientId}.{username}.accessToken
    const keys = Object.keys(sessionStorage);
    const accessTokenKey = keys.find(key => key.includes('accessToken'));
    
    if (accessTokenKey) {
      return {
        accessToken: sessionStorage.getItem(accessTokenKey),
        tokenKey: accessTokenKey
      };
    }
    return null;
  });

  if (sessionData?.accessToken) {
    console.log('🔑 Access token extracted for API calls');
    // Save token to file for test specs to use
    const tokenFile = path.join(authDir, 'token.json');
    fs.writeFileSync(tokenFile, JSON.stringify({
      accessToken: sessionData.accessToken,
      extractedAt: new Date().toISOString()
    }));
  } else {
    console.warn('⚠️  Could not extract access token from session');
  }

  console.log('🎉 Setup complete! Tests can now run with authenticated session.\n');
});
