/**
 * Global Playwright Test Fixtures
 * 
 * Provides custom fixtures for all tests including:
 * - Session storage restoration for Amplify auth
 */

import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { testConfig } from './test-helpers/config';

export const test = base.extend({
  page: async ({ page }, use) => {
    // Inject sessionStorage before each test (Playwright doesn't restore sessionStorage automatically)
    const authFile = path.join(process.cwd(), '.auth/user.json');
    if (fs.existsSync(authFile)) {
      const auth = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
      const sessionStorageData = auth.origins?.find((o: any) => o.origin === testConfig.dashboardUrl)?.sessionStorage || [];
      
      if (sessionStorageData.length > 0) {
        await page.addInitScript((data) => {
          for (const { name, value } of data) {
            window.sessionStorage.setItem(name, value);
          }
        }, sessionStorageData);
      }
    }
    
    // Use the page in the test
    await use(page);
  },
});

export { expect } from '@playwright/test';
