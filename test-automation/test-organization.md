# Test Organization & Structure

## Overview

This document defines how automated **dashboard UI tests** are organized, named, and structured for team clarity.

**Testing Approach:** Full browser automation using Playwright to test actual Next.js dashboard UI pages, forms, tables, filters, and navigation - not just raw API endpoints.

---

## Test Workflows Summary

Based on the QA Plan, we have **6 primary workflows** grouped into **3 test categories**:

### Category 1: Foundation (Critical Path) ⭐
**Sequential dependency required - all other tests depend on these**

| Workflow | Dashboard Pages | File Name | Priority |
|----------|----------------|-----------|----------|
| **1. Customer Management** | `/individuals`, `/businesses`, `[id]` detail views | `01-customer-management.spec.ts` | CRITICAL |

### Category 2: Core Operations
**Primary business functionality - independent tests**

| Workflow | Dashboard Pages | File Name | Priority |
|----------|----------------|-----------|----------|
| **2. Account Management** | `/accounts`, `/accounts/[id]`, account search, status updates | `02-account-management.spec.ts` | HIGH |
| **3. Transaction Creation** | `/transactions/newTransaction` form (transfer, adjustment, wire) | `03-transaction-creation.spec.ts` | HIGH |
| **4. Transaction History** | `/transactions/transactionHistory` table with filters, `/transactions/transactionReview` | `04-transaction-history.spec.ts` | HIGH |
| **5. ACH Processing** | `/ach/processing` upload form, `/ach/processing/achTransStatus` | `05-ach-processing.spec.ts` | HIGH |

### Category 3: Monitoring & Events
**Supporting functionality - verification workflows**

| Workflow | Dashboard Pages | File Name | Priority |
|----------|----------------|-----------|----------|
| **6. Compliance Monitoring** | `/compliance/ofac`, `/compliance/314a`, `/compliance/limits` with search/filters | `06-compliance.spec.ts` | MEDIUM |

---

## File Naming Convention

### Pattern: `[number]-[domain].spec.ts`

**Components:**
- `[number]`: Execution order (01-06) based on dependencies
- `[domain]`: Feature domain (core-workflow, accounts, transactions, etc.)
- `.spec.ts`: Playwright E2E test file

**Examples:**
```
e2e/critical-paths/
  ├── 01-customer-management.spec.ts     ← UI: Individuals/businesses tables
  ├── 02-account-management.spec.ts      ← UI: Accounts table, search, detail views
  ├── 03-transaction-creation.spec.ts    ← UI: New Transaction form
  ├── 04-transaction-history.spec.ts     ← UI: Transaction History table/filters
  ├── 05-ach-processing.spec.ts          ← UI: ACH file upload form
  └── 06-compliance.spec.ts              ← UI: Compliance pages/tables
```

**Why this pattern?**
- ✅ **Alphabetical = Execution order** (sorted naturally)
- ✅ **Context at a glance** (domain name tells you what's tested)
- ✅ **Clear dependencies** (01 must pass before 02-06)
- ✅ **Team-friendly** (engineers understand immediately)

---

## Role-Tagged Test Architecture

**Pattern:** Option A - Centralized with Role Tags

Every test file is organized into THREE describe blocks by role:

### [Shared] Common Workflows
```typescript
test.describe('[Shared] Feature Name - Common UI Workflows', () => {
  // Tests that work for both Admin and Fintech Admin
  // Data scope differs (multi-tenant vs single-tenant)
  
  test('[Shared] should load page', async ({ page }) => {
    // UI workflow accessible to both roles
  });
});
```

### [Fintech Admin] Tenant Isolation
```typescript
test.describe('[Fintech Admin] Feature Name - Tenant Isolation', () => {
  // Verification of tenant-scoped access
  
  test('[Fintech Admin] should only see own tenant data', async ({ page }) => {
    // Verify tenant isolation
  });
});
```

### [Bank Admin] Multi-Tenant Access (Future)
```typescript
test.describe('[Bank Admin] Feature Name - Multi-Tenant Access', () => {
  // Admin-only and multi-tenant features
  
  test.skip('[Bank Admin] should see all tenant data', async ({ page }) => {
    // TODO: Requires bank admin credentials
  });
});
```

**Benefits:**
- ✅ Clear role separation within each feature
- ✅ Fintech Admin and Bank Admin tests co-located
- ✅ Easy to run tests by role using `--grep "\[Shared\]"`
- ✅ Future Bank Admin tests stubbed and ready

---

## Test Suite Structure Within Files

Each test file follows this pattern:

```typescript
import { test, expect } from '@playwright/test';
import { testConfig } from '../test-helpers/config';

test.describe('[Feature] - [Dashboard Page/Workflow]', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login to dashboard (if auth required)
    await page.goto(testConfig.baseUrl);
    // Add authentication steps here
  });

  test.afterAll(async () => {
    // Clean up test data via API helper
    await testCleanup.cleanupAll();
  });

  test.describe('[Sub-workflow Name]', () => {
    
    test('Happy: should [expected behavior via UI]', async ({ page }) => {
      // ARRANGE - Navigate to page
      await page.goto('/feature/page');
      
      // ACT - Interact with UI elements
      await page.fill('input[name="field"]', 'value');
      await page.click('button:has-text("Submit")');
      
      // ASSERT - Verify UI state/response
      await expect(page.locator('.success-message')).toBeVisible();
      await expect(page.locator('table tbody tr')).toHaveCount(1);
    });

    test('Edge: should handle [edge case] correctly', async ({ page }) => {
      // Edge case scenarios through UI
    });

    test('Ugly: should display error when [invalid action]', async ({ page }) => {
      // Error handling through UI
    });
  });
});
```
    // Setup: Log test context
  });

  test.afterAll(async () => {
    // Cleanup: Delete test entities
    await testCleanup.cleanupAll();
  });

  // Group 1: Happy Path Tests
  test.describe('[Feature] - Happy Path', () => {
    test('should [expected behavior]', async () => {
      // ARRANGE: Set up test data
      // ACT: Execute operation
      // ASSERT: Verify success
    });
  });

  // Group 2: Edge Case Tests
  test.describe('[Feature] - Edge Cases', () => {
    test('should [edge behavior]', async () => {
      // Test boundary conditions
    });
  });

  // Group 3: Ugly Case Tests
  test.describe('[Feature] - Error Handling', () => {
    test('should [error behavior]', async () => {
      // Test failure scenarios
    });
  });
});
```

---

## Dashboard UI Testing Patterns

### Pattern 1: Form Submission Workflows
```typescript
test('should create customer via form', async ({ page }) => {
  // Navigate to create page
  await page.goto('/individuals/create');
  
  // Fill form fields
  await page.fill('input[name="firstName"]', 'John');
  await page.fill('input[name="lastName"]', 'Doe');
  await page.fill('input[name="ssn"]', '123-45-6789');
  await page.fill('input[name="dateOfBirth"]', '1990-01-01');
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Verify success
  await expect(page.locator('.success-notification')).toBeVisible();
  await expect(page).toHaveURL(/\/individuals\/[a-z0-9-]+/);
});
```

### Pattern 2: Table Search & Filter
```typescript
test('should filter accounts table by status', async ({ page }) => {
  // Navigate to accounts list
  await page.goto('/accounts');
  
  // Wait for table to load
  await page.waitForSelector('table tbody tr');
  
  // Apply filter
  await page.selectOption('select[name="status"]', 'ACTIVE');
  await page.click('button:has-text("Apply Filters")');
  
  // Verify filtered results
  const rows = page.locator('table tbody tr');
  await expect(rows).toHaveCountGreaterThan(0);
  
  // Verify all rows match filter
  const statuses = await rows.locator('td:nth-child(3)').allTextContents();
  expect(statuses.every(s => s === 'ACTIVE')).toBe(true);
});
```

### Pattern 3: Navigation & Detail Views
```typescript
test('should navigate to account detail page', async ({ page }) => {
  // Start at accounts list
  await page.goto('/accounts');
  
  // Click first account in table
  await page.click('table tbody tr:first-child a');
  
  // Verify navigation to detail page
  await expect(page).toHaveURL(/\/accounts\/[a-z0-9-]+/);
  
  // Verify detail page loaded
  await expect(page.locator('h1')).toContainText('Account Details');
  await expect(page.locator('.account-number')).toBeVisible();
});
```

### Pattern 4: Multi-Step Workflows
```typescript
test('should complete wire transaction workflow', async ({ page }) => {
  // Step 1: Navigate to new transaction
  await page.goto('/transactions/newTransaction');
  
  // Step 2: Look up account
  await page.fill('input[name="accountNumber"]', '123456789');
  await page.click('button:has-text("Look Up")');
  await expect(page.locator('.account-details')).toBeVisible();
  
  // Step 3: Select transaction type
  await page.click('button[value="wire"]');
  
  // Step 4: Fill transaction details
  await page.fill('input[name="amount"]', '1000.00');
  await page.fill('input[name="description"]', 'Test wire');
  
  // Step 5: Select counterparty
  await page.fill('input[name="counterpartyName"]', 'Test Bank');
  await page.click('li[role="option"]:has-text("Test Bank")');
  
  // Step 6: Review and submit
  await page.click('button:has-text("Review")');
  await page.click('button:has-text("Confirm")');
  
  // Step 7: Verify success
  await expect(page.locator('.transaction-success')).toBeVisible();
  await expect(page.locator('.payment-id')).toBeVisible();
});
```

---

## Test Case Triads (Rule of Three)

**Every testable UI workflow must have exactly 3 test cases:**

### Example: "Create Individual Customer via UI"

| Type | Test Case | Why |
|------|-----------|-----|
| **Happy** | `should create individual customer through form submission` | Normal, expected success flow through UI |
| **Edge** | `should show validation error for duplicate SSN` | Boundary condition (uniqueness constraint) displayed in UI |
| **Ugly** | `should display API error message when server fails` | Failure scenario (network error) with user feedback |

### Example: "Transaction History Search"

| Type | Test Case | Why |
|------|-----------|-----|
| **Happy** | `should display filtered transactions by date range` | Normal search with results |
| **Edge** | `should show empty state when no transactions match filter` | Boundary (zero results) |
| **Ugly** | `should show error message when search times out` | API failure handling |

---

## Logical Grouping Rationale

### Why Foundation First (01)?
- **All other UI workflows depend on customers, accounts, and counterparties existing**
- If 01 fails, pages 02-06 will have no data to display
- Critical path = creates test entities for all other tests

### Why Accounts Second (02)?
- Tests core viewing/listing functionality
- Simple table-based UI (good baseline for UI patterns)
- Account detail pages used in other workflows

### Why Transactions Third (03)?
- Most complex form in the dashboard
- Creates transaction data for transaction history (04)
- Tests multi-step workflows

### Why Transaction History Fourth (04)?
- Depends on transactions existing from (03)
- Tests advanced table features (search, filter, pagination)
- Transaction detail pages

### Why ACH Processing Fifth (05)?
- File upload workflow (different from forms)
- Batch processing status monitoring
- More complex than simple CRUD

### Why Compliance Last (06)?
- Reactive workflow (monitors results of 01-05)
- Alerts are generated by other operations
- Advanced filtering and search
- Confirms events from all other operations
- Least critical to core functionality

---

## Test Data Strategy

### Dynamic Generation (Faker.js)
```typescript
// Generate during test execution
const individual = generateIndividual(); // Random SSN, DOB, address
const business = generateBusiness();     // Random EIN, company name
const achCP = generateACHCounterparty(); // Real routing number
```

### Static Test Data (Real Banking Data)
```typescript
// Pre-defined in test-data/routing-numbers.ts
REAL_ACH_ROUTING_NUMBERS = [
  { name: 'Wells Fargo', routing: '121000248' },
  { name: 'Bank of America', routing: '026009593' },
  // ... 8 more
];

REAL_SWIFT_CODES = [
  { bank: 'Chase', swift: 'CHASUS33' },
  { bank: 'BofA', swift: 'BOFAUS3N' },
  // ... 7 more
];
```

### Configuration (Environment Variables)
```bash
# .env.local
BRAID_PRODUCT_ID=1069832  # Existing product (DO NOT create new)
BRAID_BASE_URL=https://development.braid.zone
BRAID_API_KEY=***
```

---

## Execution Order & Dependencies

```
┌─────────────────────────────────────┐
│ 01. Core Workflow (BLOCKING)       │
│ - Create customers                  │
│ - Create accounts (auto)            │
│ - Create counterparties             │
└─────────────────┬───────────────────┘
                  │
    ┌─────────────┴─────────────┬─────────────┬──────────────┐
    │                           │             │              │
    ▼                           ▼             ▼              ▼
┌───────────┐  ┌─────────────┐  ┌───────────┐  ┌────────────┐
│ 02. Trans │  │ 03. Accounts│  │ 04. ACH   │  │ 05. Comply │
│ (HIGH)    │  │ (HIGH)      │  │ (HIGH)    │  │ (MEDIUM)   │
└─────┬─────┘  └──────┬──────┘  └─────┬─────┘  └──────┬─────┘
      │               │               │               │
      └───────────────┴───────────────┴───────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ 06. Webhooks     │
                    │ (MEDIUM)         │
                    └──────────────────┘
```

**Key:**
- **BLOCKING**: If this fails, stop all tests
- **HIGH**: Core business functionality
- **MEDIUM**: Supporting/verification features

---

## Team Communication

### For Engineers
- **File names tell you the domain**: `02-accounts.spec.ts` = account management
- **Numbers tell you dependencies**: 01 runs first, others depend on it
- **Triple test pattern**: Every feature has Happy/Edge/Ugly cases

### For QA/Product
- **Test reports group by workflow**: Easy to see which area has issues
- **Priority levels clear**: CRITICAL failures block everything
- **Coverage is systematic**: Rule of Three ensures completeness

### For Management
- **6 workflows = 6 report sections**: ACH Processing at 100%, Webhooks at 80%, etc.
- **Execution time predictable**: ~25-30 minutes total for E2E suite
- **Failure impact clear**: "Core Workflow failed" = no other tests ran

---

## Adding New Workflows

### Decision Tree

```
1. Does it create foundational entities (customers/accounts)?
   YES → Add to 01-core-workflow.spec.ts
   NO  → Continue

2. Is it a primary business operation (transactions/accounts)?
   YES → Create new file: 0X-[domain].spec.ts (X = 2-4 range)
   NO  → Continue

3. Is it monitoring/verification only?
   YES → Create new file: 0X-[domain].spec.ts (X = 5-6 range)
   NO  → Continue

4. Does it depend on specific other workflows?
   YES → Number it AFTER its dependencies
   NO  → Number it in logical business priority order
```

### Template for New File

```typescript
/**
 * [Workflow Name] E2E Test
 * 
 * Tests [brief description of what this workflow covers].
 * 
 * Dependencies: [List any blocking workflows, e.g., "01-core-workflow"]
 * Priority: [CRITICAL | HIGH | MEDIUM | LOW]
 */

import { test, expect } from '@playwright/test';
// ... imports

test.describe('[Workflow Name] - [Description]', () => {
  
  test.beforeAll(async () => {
    console.log(`\n🚀 Starting [Workflow] Tests on ${testConfig.environment}`);
  });

  test.afterAll(async () => {
    await testCleanup.cleanupAll();
  });

  // Happy Path: [Feature]
  test.describe('[Feature] - Happy Path', () => {
    test('should [successful behavior]', async () => {
      // Test implementation
    });
  });

  // Edge Cases: [Feature]
  test.describe('[Feature] - Edge Cases', () => {
    test('should [boundary behavior]', async () => {
      // Test implementation
    });
  });

  // Error Handling: [Feature]
  test.describe('[Feature] - Error Handling', () => {
    test('should [error behavior]', async () => {
      // Test implementation
    });
  });
});
```

---

## Directory Structure

```
e2e/
├── critical-paths/              # Main test files (numbered for order)
│   ├── 01-core-workflow.spec.ts
│   ├── 02-accounts.spec.ts
│   ├── 03-transactions.spec.ts
│   ├── 04-ach-processing.spec.ts
│   ├── 05-compliance.spec.ts
│   └── 06-webhooks-events.spec.ts
│
├── test-helpers/                # Shared utilities
│   ├── config.ts               # Environment config reader
│   ├── api-client.ts           # Axios HTTP client
│   ├── cleanup.ts              # Entity cleanup
│   └── assertions.ts           # Custom assertions (future)
│
├── test-data/                   # Test data generators & fixtures
│   ├── generators.ts           # Faker.js generators
│   ├── routing-numbers.ts      # Real ACH/Wire routing data
│   └── fixtures.ts             # Static test fixtures (future)
│
└── README.md                    # Quick start guide
```

---

## Success Criteria

✅ **A team member can:**
1. Look at file names and understand what's tested
2. Understand execution order from numbering
3. Find tests for a specific feature easily
4. Add new tests following established patterns
5. Interpret test results without reading code

✅ **Test reports show:**
1. Clear workflow sections (6 groups)
2. Failure categorization (Happy/Edge/Ugly)
3. Dependencies (which workflows blocked)
4. Coverage completeness (all features have 3 tests)

---

## Questions for Stakeholders

Before finalizing, confirm:

1. **File naming**: Is `01-core-workflow.spec.ts` clear enough, or prefer `01-customer-account-counterparty.spec.ts`?
2. **Grouping**: Should ACH Processing (04) be split into separate upload vs settlement tests?
3. **Priority levels**: Agree on CRITICAL/HIGH/MEDIUM labels?
4. **Execution order**: Any dependencies we missed?
5. **New workflows**: Any planned features that need test files?

---

## Revision History

| Date | Change | Author |
|------|--------|--------|
| 2026-02-14 | Initial organization structure | QA Agent |

