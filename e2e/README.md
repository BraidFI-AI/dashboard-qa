# E2E Test Suite

End-to-end tests for Braid Core Web Dashboard using Playwright and real API calls.

## Prerequisites

### 1. Test User Account (Requires Infra Team)

**CRITICAL:** Automated tests require a dedicated test user account **without 2FA enabled**.

**Request from Infrastructure Team:**
- Create Cognito user with Fintech Admin (DEVELOPER_ROUTE) role
- Username: `qagentuser-test` (or approved naming convention)
- **2FA: DISABLED** (required for automation)
- Assign to test tenant with Product ID 1069832
- Provide credentials securely

**Why 2FA Must Be Disabled:**
Automated tests cannot handle time-based 2FA codes. A dedicated test account without 2FA is required for CI/CD automation.

### 2. Environment Setup

Create `.env.local` in project root:
```bash
cp .env.local.template .env.local
```

### 3. Configure Variables

Edit `.env.local` with credentials from infra team:
```bash
BRAID_ENV=development

# Dashboard URL (for UI testing)
BRAID_BASE_URL=https://dashboard.development.braid.zone

# API URL (for data operations) - optional, defaults to https://api.development.braid.zone
BRAID_API_URL=https://api.development.braid.zone

# API Key (fallback auth, not typically used)
BRAID_API_KEY=your_actual_api_key_here

# Test credentials (2FA must be disabled)
BRAID_TEST_USERNAME=qagentuser1
BRAID_TEST_PASSWORD=password_from_infra_team

# Test product ID
BRAID_PRODUCT_ID=1069832
```

**Important Notes:**
- **Dashboard vs API URLs**: Tests use `BRAID_BASE_URL` for UI navigation and `BRAID_API_URL` for API calls
- **Authentication**: API calls use Bearer token (extracted from Cognito session), not API key
- **Token Storage**: Auth setup extracts Cognito access token and saves to `.auth/token.json`
- **2FA Must Be Disabled**: Automated tests cannot handle 2FA codes

### 4. Install Dependencies
```bash
npm install
```

## Running Tests

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run Specific Test File
```bash
npx playwright test e2e/critical-paths/01-customer-management.spec.ts
```

### Run Tests in UI Mode (Interactive)
```bash
npm run test:e2e:ui
```

### Run Tests in Debug Mode
```bash
npm run test:e2e:debug
```

### Run Tests with Specific Browser
```bash
npx playwright test --project=chromium
```

## Test Structure

```
e2e/
├── critical-paths/              # Main test suites (Role-Tagged Architecture)
│   ├── 01-customer-management.spec.ts  # Individuals, businesses (CRITICAL)
│   ├── 02-account-management.spec.ts   # Accounts table and details (HIGH)
│   ├── 03-transaction-creation.spec.ts # New transaction form (HIGH)
│   ├── 04-transaction-history.spec.ts  # Transaction history and filters (HIGH)
│   ├── 05-ach-processing.spec.ts       # ACH file upload and NOC (HIGH)
│   └── 06-compliance.spec.ts           # OFAC, 314a, Limits (MEDIUM)
│
├── test-helpers/                # Shared utilities
│   ├── config.ts               # Environment configuration
│   ├── api-client.ts           # API client with auth
│   └── cleanup.ts              # Test entity cleanup
│
└── test-data/                   # Test data generators
    ├── generators.ts           # Faker.js data generators
    └── routing-numbers.ts      # Real banking data
```

## Authentication Architecture

### Two-Phase Authentication

E2E tests use a two-phase authentication approach to mirror production behavior:

**Phase 1: Dashboard Authentication (Setup)**
- Auth setup logs into dashboard UI via Cognito
- User credentials authenticate against Amplify/Cognito
- Authenticated session state saved to `.auth/user.json`
- All subsequent tests reuse this session state

**Phase 2: API Authentication (Test Execution)**
- During auth setup, Cognito access token is extracted from sessionStorage
- Token saved to `.auth/token.json` for API operations
- API client automatically loads token and adds `Authorization: Bearer {token}` header
- Mirrors production: Dashboard's ApiClient uses `fetchAuthSession()` → Bearer token

### Authentication Flow

```
1. Auth Setup (e2e/auth.setup.ts)
   ├─ Navigate to dashboard
   ├─ Fill login form with credentials
   ├─ Cognito authenticates user
   ├─ Extract access token from sessionStorage
   ├─ Save to .auth/token.json
   └─ Save session state to .auth/user.json

2. Test Execution
   ├─ Browser loads session from .auth/user.json (UI navigation)
   └─ API client loads token from .auth/token.json (API calls)
```

### Key Files
- `e2e/auth.setup.ts` - Handles login and token extraction
- `e2e/test-helpers/api-client.ts` - API client with Bearer token auth
- `e2e/test-helpers/config.ts` - Separates dashboard URL from API URL
- `.auth/user.json` - Playwright session storage (cookies, localStorage)
- `.auth/token.json` - Cognito access token for API calls

### Why Separate Dashboard and API URLs?

- **Dashboard URL** (`https://dashboard.development.braid.zone`) - Next.js frontend
  - Used for: Page navigation, UI interactions, screenshots
  - Auth: Cognito session via Amplify Authenticator
  
- **API URL** (`https://api.development.braid.zone`) - Backend API
  - Used for: Creating test data, cleanup operations
  - Auth: Bearer token extracted from Cognito session

### Troubleshooting Auth

**Issue**: API returns 401 Unauthorized
- Check `.auth/token.json` exists
- Token expires after ~1 hour - re-run auth setup

**Issue**: Dashboard login fails
- Verify 2FA is disabled on test account
- Check credentials in `.env.local`

**Issue**: "undefined challengeName" error
- Ensure Playwright config has no global HTTP headers interfering with Cognito

## Role-Tagged Test Architecture

All test files follow **Option A: Centralized with Role Tags** pattern:

```typescript
// Each test file has THREE describe blocks:

[Shared] Tests
├─ Common workflows for both Admin & Fintech Admin
├─ Data scope differs (multi-tenant vs single-tenant)
└─ UI and navigation tests

[Fintech Admin] Tests
├─ Tenant isolation validation
├─ Single tenant data verification
└─ Access restrictions

[Bank Admin] Tests (Future)
├─ Multi-tenant features (stubbed with test.skip())
└─ Admin-only features (requires bank admin credentials)
```

## Test Execution Order

Tests are numbered for reference:

1. **01-customer-management** - Individuals/businesses tables
2. **02-account-management** - Accounts table and detail pages
3. **03-transaction-creation** - New transaction form
4. **04-transaction-history** - Transaction history with filters
5. **05-ach-processing** - ACH file upload
6. **06-compliance** - OFAC, 314a, velocity limits

## Test Patterns

### Every Test Follows "Rule of Three"

1. **Happy Path** - Normal, expected behavior
2. **Edge Cases** - Boundary conditions, unusual but valid inputs
3. **Ugly Cases** - Error handling, invalid inputs, failures

Example:
```typescript
// Happy Path
test('should create customer with valid data', async () => {
  // Valid inputs → Success
});

// Edge Case
test('should handle customer with maximum field lengths', async () => {
  // Boundary values → Success
});

// Ugly Case
test('should reject customer with duplicate SSN', async () => {
  // Invalid input → Proper error
});
```

## Test Data Strategy

### Dynamic Generation (Faker.js)
```typescript
import { generateIndividual, generateBusiness } from '../test-data/generators';

const customer = generateIndividual(); // Random but realistic data
const business = generateBusiness();   // Company with EIN, address, etc.
```

### Real Banking Data
```typescript
import { REAL_ACH_ROUTING_NUMBERS } from '../test-data/routing-numbers';

// Tests use actual Wells Fargo, BofA, Chase routing numbers
// Wire tests use real SWIFT codes: CHASUS33, BOFAUS3N, etc.
```

## Cleanup

Tests automatically clean up created entities:

```typescript
test.afterAll(async () => {
  await testCleanup.cleanupAll();
});
```

Tracked entities:
- Customers (individuals, businesses)
- Counterparties (ACH, Wire)
- Transactions
- Accounts

## Debugging Failed Tests

### View Test Report
```bash
npx playwright show-report
```

### Check Screenshots/Videos
Failed tests automatically capture screenshots and videos in:
```
test-results/
playwright-report/
```

### Increase Timeout
Edit `playwright.config.ts`:
```typescript
timeout: 180000, // 3 minutes (default)
```

### Enable Verbose Logging
```typescript
// In test file
console.log('Debug info:', response.data);
```

## Common Issues

### Issue: API Key Invalid
**Solution**: Verify `BRAID_API_KEY` in `.env.local`

### Issue: Product Not Found
**Solution**: Confirm `BRAID_PRODUCT_ID=1069832` (do NOT create new product)

### Issue: Tests Timing Out
**Solution**: Check network connection, increase timeout, verify API is accessible

### Issue: Entities Not Cleaned Up
**Solution**: Manually delete via API or dashboard, or run cleanup script

### Issue: Test Data Conflicts
**Solution**: Faker.js generates unique data each run - conflicts are rare

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run E2E Tests
  run: npm run test:e2e
  env:
    BRAID_BASE_URL: ${{ secrets.BRAID_BASE_URL }}
    BRAID_API_KEY: ${{ secrets.BRAID_API_KEY }}
    BRAID_PRODUCT_ID: 1069832
```

### Test Results
Tests generate JSON results for CI parsing:
```
test-results/results.json
```

## Best Practices

1. **Never hardcode credentials** - Always use environment variables
2. **Clean up test data** - Use `testCleanup` helper
3. **Use real banking data** - Import from `routing-numbers.ts`
4. **Follow naming conventions** - `[number]-[domain].spec.ts`
5. **Add descriptive console logs** - Help debug failures
6. **Test one thing at a time** - Keep tests focused
7. **Assert meaningfully** - Check relevant fields, not everything

## Writing New Tests

### Template
```typescript
import { test, expect } from '@playwright/test';
import { testConfig } from '../test-helpers/config';
import apiClient from '../test-helpers/api-client';
import testCleanup from '../test-helpers/cleanup';

test.describe('My Feature Tests', () => {
  
  test.beforeAll(async () => {
    console.log(`\n🚀 Starting My Feature Tests`);
    // Setup test data
  });

  test.afterAll(async () => {
    await testCleanup.cleanupAll();
  });

  // Happy Path
  test('should do the thing successfully', async () => {
    // ARRANGE - Set up test data
    // ACT - Execute operation
    // ASSERT - Verify results
  });

  // Edge Case
  test('should handle boundary condition', async () => {
    // Test edge case
  });

  // Ugly Case
  test('should reject invalid input', async () => {
    try {
      // Should fail
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.response.status).toBeGreaterThanOrEqual(400);
    }
  });
});
```

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Faker.js Documentation](https://fakerjs.dev/)
- [Test Generator Guide](../test-automation/test-generator-guide.md)
- [Test Coverage by Role](../test-automation/test-coverage-by-role.md)
- [Role Access Matrix](../test-automation/role-access-matrix.md)
- [Test Organization](../test-automation/test-organization.md)
- [Role Architecture Proposal](../test-automation/role-architecture-proposal.md)

## Support

For questions or issues:
1. Check test output logs
2. Review test-automation documentation
3. Verify API endpoint availability
4. Contact DevOps team for environment issues
