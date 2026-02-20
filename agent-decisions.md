# Agent Decisions Log

## 2026-02-13: Testing Framework Selection

**Decision**: Use Vitest instead of Jest for unit/UI tests  
**Rationale**: Native ESM support, faster execution with Vite, better Next.js 15 compatibility, built-in TypeScript support without additional config. Dashboard already uses Vite toolchain indirectly through modern build pipeline.

---

## 2026-02-13: E2E Framework Selection

**Decision**: Use Playwright instead of Cypress  
**Rationale**: Better multi-browser support (Chromium, Firefox, WebKit), built-in test parallelization, auto-wait mechanism reduces flaky tests, better debugging tools, works with real HTTP calls to Braid test API without additional proxy setup.

---

## 2026-02-13: API Mocking Strategy

**Decision**: Use Mock Service Worker (MSW) 2.x for Unit/UI tests  
**Rationale**: Intercepts requests at network level (not Axios level), works in both Node.js and browser environments, allows gradual migration to real API calls, maintains consistency between unit and integration test mocks. E2E tests bypass MSW entirely and hit real Braid test API.

---

## 2026-02-13: Three-Workflow Testing System

**Decision**: Separate GitHub Actions workflows for Unit, UI, and E2E tests  
**Rationale**: Independent failure isolation (unit failures don't block E2E), different execution times (3-5min vs 25-30min), staggered schedules prevent resource contention, allows targeted re-runs without running full suite.

**Tradeoff**: More complex CI/CD setup vs simpler single workflow. Chose complexity for better observability and faster feedback loops.

---

## 2026-02-13: Test Data Strategy

**Decision**: Stable test grouping in Braid test API (not dynamic create/destroy)  
**Rationale**: Avoids foreign key dependency hell (Program → Product → Account → Transaction chain), prevents test pollution from orphaned entities, allows parallel test execution without conflicts, matches production-like data patterns.

**Tradeoff**: Requires one-time manual setup and pre-run state reset vs fully automated setup. Chose stability over automation complexity.

---

## 2026-02-13: Test Case Methodology

**Decision**: Rule of Three - every testable unit requires exactly 3 cases (Happy Path, Edge Cases, Ugly Cases)  
**Rationale**: Predictable coverage pattern, easy to review completeness, AI agents can validate adherence automatically, prevents under-testing and over-testing extremes.

---

## 2026-02-13: DOM Environment

**Decision**: Install both jsdom and happy-dom  
**Rationale**: jsdom for standard compatibility, happy-dom for faster execution. Allows per-test-suite optimization based on needs. Plan to use happy-dom for unit tests (speed), jsdom for UI tests (compatibility with Testing Library).

---

## 2026-02-14: Test Generation Method - Option 3 (Generator Script)

**Decision**: Implement test file generation using Node.js script (`test-automation/scripts/generate-tests.js`)

**Alternatives Considered**:
- Option 1: Create files one-by-one with create_file tool (manual, not scalable)
- Option 2: Provide templates for manual creation (inconsistent)
- Option 3: Generator script (chosen)

**Rationale**: Reproducible and scalable foundation for team use. Can be used by other developers and CI/CD infrastructure. Version-controlled test specifications (TEST_SPECS array) serve as source of truth. Ensures consistent structure across all test files. Extensible for future test additions.

**Outcome**: Successfully generated 5 test files (02-06) with consistent role-tagged structure. Script is npm-integrated (`npm run generate-tests`) and documented in test-generator-guide.md.

---

## 2026-02-14: Documentation Naming Convention - Lowercase (Except README.md)

**Decision**: Use lowercase naming for all markdown documentation files except README.md

**Context**: User preference expressed after INFRA-REQUEST.md was created in uppercase

**Implementation**:
- Renamed: ROLE-ARCHITECTURE-PROPOSAL.md → role-architecture-proposal.md
- Renamed: TEST-GENERATOR-GUIDE.md → test-generator-guide.md
- Renamed: FOUNDATION-REBUILD-PLAN-COMPLETED.md → foundation-rebuild-plan-completed.md
- Renamed: INFRA-REQUEST.md → infra-request.md
- Kept: README.md (uppercase by user request)

**Rationale**: Consistency across project, user preference for lowercase naming improves discoverability and reduces case-sensitivity issues across different filesystems.

---

## 2026-02-14: Test Execution Blocked by 2FA

**Blocker Identified**: Test user account has 2FA enabled, automated tests cannot handle TOTP codes

**Decision**: Document blocker and create infrastructure request for dedicated test account

**Technical Constraint**: Playwright (and all browser automation tools) cannot programmatically retrieve time-based 2FA codes without security bypass mechanisms

**Resolution Path**:
- Infrastructure team must create Cognito user with DEVELOPER_ROUTE role
- Account must have 2FA disabled (security mitigated by tenant isolation and test environment)
- Created `test-automation/infra-request.md` with complete specifications and security justification

**Status**: Test infrastructure 100% ready, waiting on infrastructure team for credentials

**Alternative Rejected**: Using API-only tests instead of UI tests - would not validate user-facing workflows and actual browser interactions

---

## 2026-02-15: Manual 2FA Workarounds Rejected

**Decision**: Do not implement manual 2FA intervention workarounds for production test automation

**Alternatives Attempted**:
- Mode 1: `page.pause()` for human to enter 2FA codes (requires developer presence, not automatable)
- Manual cookie capture from regular browser session (fragile, expires after 24 hours, not CI-friendly)
- Enabling MFA in local Amplify config (doesn't affect deployed dashboard at `dashboard.development.braid.zone`)

**Rationale**: All workarounds have critical flaws:
- Cannot run in CI/CD (GitHub Actions)
- Cannot run on schedules (2AM UTC daily target)
- Require manual intervention for every test run
- Not maintainable or scalable
- Don't test actual authentication flow

**Final Decision**: Wait for infrastructure team to provide 2FA-disabled test account as specified in `test-automation/infra-request.md`

**Current State**: 
- `e2e/auth.setup.ts` restored to clean blocked state (will timeout on 2FA)
- `playwright.config.ts` restored to headless mode (production CI configuration)
- All workaround files removed (amplifyconfiguration.json, manual-auth-capture.md)
- Test infrastructure remains 100% ready for automated execution when proper credentials are provided

---

## 2026-02-15: Local Development Mode for Manual Testing

**Decision**: Add `LOCAL_DEV_MODE` flag to enable local testing with manual 2FA entry

**Context**: While waiting for infrastructure team to provide 2FA-disabled credentials, developers can validate test implementation locally.

**Implementation**:
- Added `LOCAL_DEV_MODE` environment variable check in `e2e/auth.setup.ts` (line 22)
- When enabled: browser shows (headless=false) and pauses for manual 2FA entry
- When disabled (default): runs in headless mode for CI/CD, will timeout on 2FA
- Added npm script: `npm run test:e2e:local` sets flag automatically

**Rationale**:
- ✅ Allows local test validation and debugging
- ✅ Doesn't compromise CI/CD production-ready state
- ✅ Explicit opt-in (default behavior remains blocked)
- ✅ Easy to use: single command `npm run test:e2e:local`
- ✅ Self-documenting through environment variable name

**Production behavior unchanged**: `npm run test:e2e` (CI/CD command) remains blocked until infra provides credentials

---

## 2026-02-15: 2FA Blocker Remains Active

**Status**: Infrastructure team has not yet disabled 2FA on test account

**Evidence**: Test run on February 15, 2026 at 13:30 failed with same error:
- Error message: "undefined challengeName returned by the underlying service was not addressed"
- Screenshot: `test-results/auth.setup.ts-authenticate-setup/test-failed-1.png`
- Failure point: Line 38 in `e2e/auth.setup.ts` (waiting for navigation after login)

**Attempted workarounds removed**:
- Removed `LOCAL_DEV_MODE` manual intervention code
- Removed `test:e2e:local` npm script
- Kept codebase in clean production-ready state

**Current State**: 
- ❌ Tests blocked at authentication step
- ❌ Cannot run automated or manual execution
- ✅ All test code ready (66 tests implemented)
- ⏳ Waiting for infrastructure team to actually disable 2FA on Cognito user
- 📋 Infrastructure request remains pending: `test-automation/infra-request.md`

**Next Action**: Follow up with infrastructure team on request status

---

## 2026-02-19: Authentication Blocker Resolved - Playwright Config Issue

**Decision**: Remove `extraHTTPHeaders` from Playwright configuration

**Root Cause Discovered**: 
- Playwright's `extraHTTPHeaders` config was forcing `Content-Type: application/json` and `Accept: application/json` on ALL requests
- These headers broke Cognito API authentication flow
- Cognito returned `UnknownOperationException` when receiving wrong content type
- Amplify interpreted this as "undefined challengeName" error

**Debugging Process**:
1. User confirmed manual login works in incognito browser (ruled out cache/session issues)
2. Added console logging to capture Cognito API responses
3. Observed `UnknownOperationException` error in Cognito response
4. Identified `extraHTTPHeaders` in `playwright.config.ts` as culprit
5. Removed headers, authentication immediately worked

**Fix Applied**: Removed lines 62-65 from `playwright.config.ts`:
```typescript
// REMOVED - was interfering with Cognito auth:
// extraHTTPHeaders: {
//   'Accept': 'application/json',
//   'Content-Type': 'application/json',
// },
```

**Resolution Date**: February 19, 2026

**Test Results After Fix**:
- ✅ Authentication setup passing
- ✅ 58 of 66 tests passing
- ❌ 2 tests failing with API 404 errors (separate issue, not auth-related)
- ⏭️ 17 Bank Admin tests skipped (expected)

**Lesson Learned**: Global HTTP headers in test frameworks can break third-party auth flows. Only apply custom headers to specific requests, not globally.

**False Lead**: Initial hypothesis blamed MFA configuration mismatch or cached sessions, but the actual issue was Playwright forcing wrong headers on Cognito requests.

---

## 2026-02-19: API Authentication Architecture - Separate Dashboard and API URLs

**Decision**: Separate dashboard URL and API URL in test configuration, use Bearer token authentication for API calls

**Problem Identified**:
- Tests were using `BRAID_BASE_URL` (dashboard URL) for both UI navigation and API calls
- API client was configured with `X-API-Key` header, but Braid API requires Bearer token authentication
- API calls returned 404 because they were hitting `https://dashboard.development.braid.zone/individual` instead of `https://api.development.braid.zone/individual`

**Solution Implemented**:
1. **Test Config Changes** (`e2e/test-helpers/config.ts`):
   - Added `dashboardUrl` property for UI navigation
   - Added `apiUrl` property for API operations
   - Maintained backward compatibility with `baseUrl` getter
   - Environment variables: `BRAID_DASHBOARD_URL` (or `BRAID_BASE_URL`) and `BRAID_API_URL`

2. **API Client Changes** (`e2e/test-helpers/api-client.ts`):
   - Changed `baseURL` to use `testConfig.apiUrl` instead of `testConfig.baseUrl`
   - Implemented token loading from `.auth/token.json`
   - Request interceptor adds `Authorization: Bearer {token}` header
   - Falls back to `X-API-Key` header if token not available

3. **Auth Setup Changes** (`e2e/auth.setup.ts`):
   - Extracts Cognito access token from sessionStorage after successful login
   - Saves token to `.auth/token.json` for test specs to consume
   - Token extraction uses Amplify's storage key pattern: `CognitoIdentityServiceProvider.{clientId}.{username}.accessToken`

4. **Test Data Generator Fixes** (`e2e/test-data/generators.ts`):
   - Changed `idNumber` generation to digits-only (no hyphens)
   - API validation requires SSN/EIN as 9 digits without formatting
   - Fixed 422 validation errors: "IdNumber should only contain digits!"

**Rationale**:
- Dashboard uses Cognito sessions for UI, but API requires Bearer tokens from Cognito for backend operations
- Separating URLs provides clear distinction between UI testing (dashboard) and data operations (API)
- Extracting token during auth setup eliminates need for manual token management in each test
- Matches production dashboard behavior (ApiClient.ts uses `fetchAuthSession()` to get Bearer token)

**Test Results After Fix**:
- ✅ Individual creation: 200 OK
- ✅ Business creation: 200 OK  
- ✅ API authentication working with Bearer tokens
- ⚠️ DELETE operations: 403 Forbidden (user lacks delete permissions, expected limitation)

**Lesson Learned**: E2E tests need to mirror production authentication flow - extract Cognito tokens from authenticated session, not use API keys. Dashboard and API are separate services with different base URLs.

---

## 2026-02-19: Global Fixture for SessionStorage Injection

**Decision**: Created `e2e/fixtures.ts` with global Playwright fixture to inject sessionStorage before every test.

**Context**: Playwright's `storageState()` doesn't save sessionStorage. Amplify uses sessionStorage for auth tokens, causing tests to redirect to login page despite saved authentication.

**Rationale**: Global fixture approach is cleaner than per-test injection and ensures all tests automatically have authentication state restored. Alternative of using cookies-based auth would require dashboard code changes.

---

## 2026-02-19: Manual SessionStorage Extraction in Auth Setup

**Decision**: Modified `auth.setup.ts` to manually extract sessionStorage via `page.evaluate()` and save to custom structure in `.auth/user.json`.

**Context**: Playwright's built-in `storageState()` only persists localStorage and cookies, not sessionStorage.

**Rationale**: Manual extraction is necessary to capture Amplify's sessionStorage-based authentication. The custom structure extends Playwright's standard format with `origins[].sessionStorage` array.

---

## 2026-02-19: Increased Backend Indexing Wait Time

**Decision**: Increased wait time after entity creation from 2s to 10s before navigating to dashboard pages.

**Context**: Customer and business entities weren't appearing in tables immediately after API creation, causing test failures.

**Rationale**: Backend search indexing is asynchronous. 10-second wait provides sufficient time for entities to be indexed and appear in dashboard queries. Alternative of polling API until data appears would be more complex and slower.

---

## 2026-02-19: Flexible Table Selectors

**Decision**: Changed table selectors from `table` to `[role="grid"], table` throughout test suite.

**Context**: MUI DataGrid renders with `role="grid"` attribute, not standard HTML `<table>` element.

**Rationale**: Flexible selector supports both standard tables and MUI DataGrid components. Increased timeout to 30s accounts for API calls and data loading.

