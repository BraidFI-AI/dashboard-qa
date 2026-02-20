# Agent Context - Core Web Dashboard QA Automation

## Testing Infrastructure

### Installed Dependencies (as of 2026-02-13)
- **Unit Testing**: vitest@4.0.18, @vitest/ui@4.0.18
- **E2E Testing**: @playwright/test@1.58.2 (browsers: Firefox 146.0.1, WebKit 26.0)
- **API Mocking**: msw@2.12.10
- **React Testing**: @testing-library/react@16.3.2, @testing-library/jest-dom@6.9.1, @testing-library/user-event@14.6.1
- **DOM Environments**: jsdom@28.0.0, happy-dom@20.6.1

### Available NPM Scripts
```bash
npm run test:unit         # Run unit tests once
npm run test:ui           # Run UI tests with MSW
npm run test:e2e          # Run E2E tests with Playwright
npm run test:all          # Run all test suites
```

### Testing Documentation
- Comprehensive plan lives in `/test-automation/agent-qa-plan.md` (620 lines)
- OpenAPI spec analyzed in `/test-automation/braid-open-api-1.8.json` (110 endpoints)
- Three-workflow system: Unit (2AM UTC), UI (2:30AM UTC), E2E (3AM UTC)
- Test case strategy: Rule of Three (Happy Path, Edge Cases, Ugly Cases)

### Test Data Architecture
- **Approach**: Stable test grouping in Braid test API (not dynamic create/destroy)
- **Entity Hierarchy**: Program(1001) → Product(2001-2003) → Account(5001-5006) → Transaction
- **Test Manifest**: `test-grouping-manifest.json` references persistent entities with API-compliant IDs

### Pending Implementation
- Configuration files: `vitest.config.ts`, `vitest.ui.config.ts`, `playwright.config.ts`
- Mock infrastructure: AWS Amplify, ApiClient, Next.js navigation mocks
- Test utilities: Redux/React Query wrappers
- GitHub Actions workflows: `.github/workflows/*-tests-daily.yml`
- AI analysis agents: Result parsing, Jira ticket creation, daily digest

---

## Test Infrastructure (Completed February 14, 2026)

### Test Generator
- Test generator script exists at `test-automation/scripts/generate-tests.js` and is production-ready
- Generates test files with consistent role-tagged structure: [Shared], [Fintech Admin], [Bank Admin]
- Accessible via `npm run generate-tests` command
- Embedded TEST_SPECS array serves as version-controlled source of truth for test structure

### Generated Test Files
- All 6 test files generated with role-tagged architecture (Option A: Centralized with Role Tags)
- Test count: 48 [Shared] + 17 [Fintech Admin] + 17 [Bank Admin] + 1 [setup] = 83 total tests
- Files: 01-customer-management, 02-account-management, 03-transaction-creation, 04-transaction-history, 05-ach-processing, 06-compliance
- 66 tests implemented and ready to run (49 Shared + 17 Fintech Admin)
- 17 Bank Admin tests stubbed with test.skip() for future implementation

### Documentation Standards
- All documentation files use lowercase naming convention (except README.md which remains uppercase)
- Complete documentation set: README.md, test-generator-guide.md, role-architecture-proposal.md, role-access-matrix.md, test-coverage-by-role.md, test-organization.md

### Dashboard Configuration
- Dashboard URL: `https://dashboard.development.braid.zone`
- Test credentials: Configured in `.env.local` (not committed to git)

### Test Execution Status (Resolved February 19, 2026)
- **Status**: ✅ Authentication working - tests running successfully
- **Root Cause**: Playwright's `extraHTTPHeaders` config was interfering with Cognito API authentication
- **Symptoms**: "undefined challengeName" error during login, Cognito returned `UnknownOperationException`
- **Fix Applied**: Removed `extraHTTPHeaders` from `playwright.config.ts` (lines 62-65)
  - Headers `Content-Type: application/json` and `Accept: application/json` were forcing wrong content type on Cognito requests
  - Cognito auth flow requires specific headers that were being overridden
- **Verification**: User confirmed manual login works in incognito browser (ruled out cache/session issues)
- **Test Results**: 58/66 tests passing, auth setup working correctly
- **Note**: 2FA was disabled by infrastructure team, but that alone didn't fix the issue - Playwright config was the blocker

### API Authentication Configuration (Fixed February 19, 2026)
- **Status**: ✅ API calls working with Bearer token authentication
- **Issue**: Tests were hitting dashboard URL instead of API URL, using wrong auth method
- **Root Cause**: `BRAID_BASE_URL` used for both dashboard and API, test config didn't separate concerns
- **Fix Applied**:
  - Separated `dashboardUrl` and `apiUrl` in test config (`e2e/test-helpers/config.ts`)
  - Dashboard URL: `https://dashboard.development.braid.zone` (for UI navigation)
  - API URL: `https://api.development.braid.zone` (for data operations)
  - API client uses Bearer token authentication (extracted from Cognito session)
  - Tokens saved to `.auth/token.json` during auth setup, auto-loaded by API client
- **Auth Flow**:
  1. Auth setup extracts Cognito access token from sessionStorage
  2. Token saved to `.auth/token.json` for test specs to use
  3. API client interceptor loads token and adds `Authorization: Bearer {token}` header
  4. Falls back to `X-API-Key` if token not available
- **Test Results**: Individual and business creation 200 OK, validation working
- **Known Issue**: User lacks DELETE permissions (403), cleanup fails but doesn't block tests

### E2E Test Authentication (Fixed February 19, 2026)
- **Status**: ✅ All tests passing - 66 passed, 17 skipped, 0 failed
- **Critical Discovery**: Playwright's `storageState()` does not persist sessionStorage (only localStorage and cookies)
- **Problem**: AWS Amplify stores authentication tokens in sessionStorage, causing tests to redirect to login page despite saved authentication state
- **Solution Implemented**:
  1. **Manual SessionStorage Extraction** (`e2e/auth.setup.ts`):
     - Extracts sessionStorage via `page.evaluate()` after successful login
     - Saves custom structure to `.auth/user.json` extending Playwright's standard format
     - Includes `origins[].sessionStorage` array with all Cognito session data
  2. **Global Fixture for Injection** (`e2e/fixtures.ts`):
     - Provides custom `page` fixture that injects sessionStorage before every test
     - Uses `page.addInitScript()` to restore sessionStorage before page loads
     - All test files import `{ test, expect }` from `'../fixtures'` instead of `'@playwright/test'`
- **Result**: Tests now maintain authenticated state across all specs without requiring re-login

### Dashboard Table Rendering
- **UI Component**: Dashboard uses MUI DataGrid which renders with `role="grid"` attribute (not standard HTML `<table>` tags)
- **Test Selectors**: Tests use flexible selector `[role="grid"], table` to support both DataGrid and standard tables
- **Backend Indexing**: Requires ~10 seconds after entity creation before data appears in dashboard tables
- **Wait Strategy**: Tests include 10-second wait in `beforeAll` hooks after API entity creation, plus conditional checks for table data vs empty states

### Test Coverage Status (February 19, 2026)
- **Passing**: 66 tests (all Fintech Admin and Shared workflows)
- **Skipped**: 17 tests (all Bank Admin tests requiring multi-tenant permissions)
- **Failing**: 0 tests
- **Test User**: `qagentuser1` has Fintech Admin role (single-tenant access only)
- **Bank Admin Tests**: Intentionally skipped with `test.skip()` until credentials with multi-tenant access are available
