# Foundation Rebuild - Complete Action Plan

**Goal:** Implement Option A (Centralized with Role Tags) from scratch, getting it right the first time.

**Philosophy:** Each test file represents a **feature domain**, not a role. Role-specific tests are separated into `[Shared]`, `[Fintech Admin]`, and `[Bank Admin]` describe blocks.

---

## 📋 COMPLETE FILE INVENTORY

### Test Files - RENAME & RESTRUCTURE

| Current File | New File | Action | Reason |
|--------------|----------|--------|--------|
| `01-core-workflow.spec.ts` | `01-customer-management.spec.ts` | Rename + Restructure | Better feature name, add role tags |
| `02-accounts.spec.ts` | `02-account-management.spec.ts` | Keep name + Restructure | Name is fine, add role tags |
| `03-transactions.spec.ts` | `03-transaction-creation.spec.ts` | Rename + Restructure | Clarify it's the "new transaction" form |
| `04-transaction-history.spec.ts` | `04-transaction-history.spec.ts` | Keep name + Restructure | Name is perfect, add role tags |
| `05-ach-processing.spec.ts` | `05-ach-processing.spec.ts` | Keep name + Restructure | Name is fine, add role tags |
| `06-compliance.spec.ts` | `06-compliance.spec.ts` | Keep name + Restructure | Name is perfect, add role tags |

### Documentation Files - DELETE

| File | Action | Reason |
|------|--------|--------|
| `test-automation/FINTECH-ADMIN-ROLE-UPDATE-PLAN.md` | ❌ DELETE | Obsolete - we chose Option A |
| `test-automation/api-analysis-summary.md` | ❌ DELETE | Old API-testing plan, not relevant to UI tests |

### Documentation Files - RENAME & RESTRUCTURE

| Current File | New File | Action | Reason |
|--------------|----------|--------|--------|
| `test-automation/comprehensive-coverage.md` | `test-automation/test-coverage-by-role.md` | Rename + Restructure | Better name, add role matrix |
| `test-automation/role-based-access.md` | `test-automation/role-access-matrix.md` | Rename + Restructure | Clearer name, convert to matrix format |
| `test-automation/test-organization.md` | `test-automation/test-organization.md` | Keep name + Restructure | Update with role tags |
| `e2e/README.md` | `e2e/README.md` | Keep name + Restructure | Add role architecture section |

### Documentation Files - KEEP AS-IS

| File | Action | Reason |
|------|--------|--------|
| `test-automation/role-architecture-proposal.md` | ✅ KEEP | Foundation document (reference) |
| `test-automation/agent-qa-plan.md` | ✅ KEEP | Original planning document |

---

## 🔧 DETAILED TRANSFORMATION REQUIREMENTS

### Test File Structure Template

Every test file should follow this structure:

```typescript
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  FEATURE: [Feature Name]                                                  ║
 * ║  Dashboard Pages: [List of pages tested]                                  ║
 * ║                                                                           ║
 * ║  Role Coverage:                                                           ║
 * ║  ✅ [Shared] Common workflows (both Admin and Fintech Admin)             ║
 * ║  ✅ [Fintech Admin] Tenant-scoped workflows (implemented)                ║
 * ║  🚧 [Bank Admin] Multi-tenant workflows (future)                        ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * Scope:
 * - [Shared] Features that work for both roles (data scope differs)
 * - [Fintech Admin] Tenant isolation validation
 * - [Bank Admin] Cross-tenant access (future implementation)
 * 
 * Current Credentials: Fintech Admin (developer-admin)
 * Authentication: Saved in .auth/user.json
 */

import { test, expect } from '@playwright/test';
import { testConfig } from '../test-helpers/config';
import apiClient from '../test-helpers/api-client';
import testCleanup from '../test-helpers/cleanup';

// ═══════════════════════════════════════════════════════════════════════════
// SHARED: Common workflows accessible to both roles
// ═══════════════════════════════════════════════════════════════════════════

test.describe('[Shared] Feature Name - Common UI Workflows', () => {
  
  test.beforeAll(async () => {
    console.log(`\n🚀 Starting [Shared] Feature Tests`);
    console.log(`🎭 Role: Both Admin & Fintech Admin`);
    console.log(`📍 Dashboard: ${testConfig.baseUrl}`);
    console.log(`🏢 Product ID: ${testConfig.productId}\n`);
    
    // Setup test data via API
  });

  test.afterAll(async () => {
    await testCleanup.cleanupAll();
  });

  test('[Shared] Happy: should perform common workflow', async ({ page }) => {
    // Test that works for both roles
  });

  test('[Shared] Edge: should handle edge case', async ({ page }) => {
    // Edge case that applies to both roles
  });

  test('[Shared] Ugly: should show error gracefully', async ({ page }) => {
    // Error handling for both roles
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// FINTECH ADMIN: Tenant-scoped specific validation
// ═══════════════════════════════════════════════════════════════════════════

test.describe('[Fintech Admin] Feature Name - Tenant Isolation', () => {
  
  test.beforeAll(async () => {
    console.log(`\n🔐 Starting [Fintech Admin] Tenant Isolation Tests`);
    console.log(`🎭 Role: Fintech Admin (developer-admin)`);
    console.log(`🏢 Tenant Scope: Single tenant only\n`);
    
    // Setup: Create test data in OUR tenant
  });

  test.afterAll(async () => {
    await testCleanup.cleanupAll();
  });

  test('[Fintech Admin] should only see own tenant data', async ({ page }) => {
    // Verify tenant isolation
  });

  test('[Fintech Admin] should not access other tenant data', async ({ page }) => {
    // Verify cannot access other tenant resources
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// BANK ADMIN: Multi-tenant and admin-only features (FUTURE)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('[Bank Admin] Feature Name - Multi-Tenant Access', () => {
  
  test.skip('[Bank Admin] should see data from all tenants', async ({ page }) => {
    // TODO: Implement when bank admin credentials available
    // Login as bank admin
    // Verify can see data across multiple tenants
    // Verify tenant filtering works
  });

  test.skip('[Bank Admin] should access admin-only features', async ({ page }) => {
    // TODO: Implement when bank admin credentials available
    // Test admin-only UI elements
    // Test admin-only actions (if applicable to this feature)
  });
});
```

---

## 📝 SPECIFIC FILE TRANSFORMATIONS

### 1. 01-core-workflow.spec.ts → 01-customer-management.spec.ts

**Current Focus:** Customer tables (individuals, businesses)

**New Structure:**
- `[Shared] Customer Management - Common UI Workflows`
  - Load individuals table
  - Load businesses table
  - Navigate to customer detail pages
  - Search/filter customers
  
- `[Fintech Admin] Customer Management - Tenant Isolation`
  - Verify only see own tenant customers
  - Verify cannot access other tenant customer IDs
  
- `[Bank Admin] Customer Management - Multi-Tenant` (skip)
  - Verify can see customers from all tenants
  - Verify tenant filter column exists
  - Verify can switch between tenants

---

### 2. 02-accounts.spec.ts → 02-account-management.spec.ts

**Current Focus:** Accounts table, account detail pages

**New Structure:**
- `[Shared] Account Management - Common UI Workflows`
  - Load accounts table
  - Search by account number
  - Navigate to account detail
  - View account tabs (Transactions, Counterparties, Limits)
  - Update account status (ACTIVE, FROZEN, CLOSED)
  
- `[Fintech Admin] Account Management - Tenant Isolation`
  - Verify only see own tenant accounts
  - Verify cannot access other tenant account numbers
  
- `[Bank Admin] Account Management - Multi-Tenant` (skip)
  - Verify can see accounts from all tenants
  - Verify can filter by tenant
  - Verify cross-tenant account search

---

### 3. 03-transactions.spec.ts → 03-transaction-creation.spec.ts

**Current Focus:** New transaction form (`/transactions/newTransaction`)

**New Structure:**
- `[Shared] Transaction Creation - Common Form Workflows`
  - Fill and submit Transfer transaction
  - Fill and submit Credit Adjustment
  - Fill and submit Debit Adjustment
  - Fill and submit Domestic Wire
  - Fill and submit International Wire
  - Form validation errors
  
- `[Fintech Admin] Transaction Creation - Tenant Scope`
  - Verify can only select accounts from own tenant
  - Verify counterparties limited to own tenant
  - Verify transaction submission creates in own tenant
  
- `[Bank Admin] Transaction Creation - Multi-Tenant` (skip)
  - Verify can create transactions for any tenant
  - Verify can select accounts across tenants

---

### 4. 04-transaction-history.spec.ts (Keep name)

**Current Focus:** Transaction history table with filters

**New Structure:**
- `[Shared] Transaction History - Common UI Workflows`
  - Load transaction history table
  - Search by payment ID
  - Filter by status (POSTED, PENDING, FAILED)
  - Filter by date range
  - Filter by transaction type
  - Navigate to transaction detail
  - Combined filters
  - Pagination
  
- `[Fintech Admin] Transaction History - Tenant Isolation`
  - Verify only see own tenant transactions
  - Verify search limited to own tenant
  
- `[Bank Admin] Transaction History - Multi-Tenant` (skip)
  - Verify can see transactions from all tenants
  - Verify can filter by tenant
  - Verify cross-tenant payment ID search

---

### 5. 05-ach-processing.spec.ts (Keep name)

**Current Focus:** ACH file upload, NOC table

**New Structure:**
- `[Shared] ACH Processing - Common UI Workflows`
  - Load ACH processing page
  - View ACH file history/status table
  - View NOC table
  - Navigation between ACH pages
  
- `[Fintech Admin] ACH Processing - Originating Files Only`
  - Upload originating ACH file (outbound)
  - File validation (reject invalid files)
  - Verify "Receiving" option NOT available
  - Verify only see own tenant ACH files
  
- `[Bank Admin] ACH Processing - All File Types` (skip)
  - Upload receiving ACH files (inbound)
  - Verify can access ACH settlement page
  - Verify can see ACH files from all tenants

---

### 6. 06-compliance.spec.ts (Keep name)

**Current Focus:** OFAC, 314(a), Velocity Limits

**New Structure:**
- `[Shared] Compliance - Common UI Workflows`
  - Load OFAC alerts page
  - Filter OFAC alerts by status
  - Search OFAC alerts
  - Navigate to OFAC alert detail
  - Load 314(a) requests page
  - Load Velocity Limits page
  - Navigation between compliance pages
  
- `[Fintech Admin] Compliance - Tenant Scope`
  - Verify only see own tenant compliance data
  - Verify OFAC alerts limited to own customers
  - Verify velocity limits limited to own accounts
  
- `[Bank Admin] Compliance - Multi-Tenant` (skip)
  - Verify can see compliance data from all tenants
  - Verify can filter compliance by tenant

---

## 📚 DOCUMENTATION TRANSFORMATIONS

### test-coverage-by-role.md (NEW NAME)

```markdown
# Test Coverage by Role

## Overview

This test suite covers dashboard UI workflows for multiple user roles:
- **Fintech Admin (Developer):** Tenant-scoped operations
- **Bank Admin:** Multi-tenant + admin-only features

## Role Coverage Matrix

| Feature | Shared Tests | Fintech Admin Tests | Bank Admin Tests |
|---------|-------------|--------------------|--------------------|
| Customer Management | ✅ 6 tests | ✅ 3 tests | 🚧 2 tests (future) |
| Account Management | ✅ 12 tests | ✅ 4 tests | 🚧 3 tests (future) |
| Transaction Creation | ✅ 15 tests | ✅ 5 tests | 🚧 2 tests (future) |
| Transaction History | ✅ 18 tests | ✅ 3 tests | 🚧 3 tests (future) |
| ACH Processing | ✅ 6 tests | ✅ 5 tests | 🚧 4 tests (future) |
| Compliance | ✅ 10 tests | ✅ 4 tests | 🚧 2 tests (future) |
| **TOTAL** | **67 tests** | **24 tests** | **16 tests (future)** |

## Test Organization

Each test file is organized by role:

### [Shared] Tests
Features accessible to both Admin and Fintech Admin.
- Data scope differs (multi-tenant vs single-tenant)
- UI and workflows are the same
- Testing common functionality

### [Fintech Admin] Tests
Tenant-scoped validation specific to Fintech Admin.
- Verify tenant isolation (only see own tenant data)
- Verify cannot access other tenant resources
- Verify restricted features are hidden

### [Bank Admin] Tests (Future)
Multi-tenant and admin-only features.
- Verify can see data from all tenants
- Verify tenant filtering works
- Verify admin-only features (settlement, programs)
- Currently stubbed with `.skip()` - requires admin credentials
```

---

### role-access-matrix.md (NEW NAME)

```markdown
# Role Access Matrix

## Dashboard Page Access by Role

| Page | Bank Admin | Fintech Admin | Notes |
|------|-----------|---------------|-------|
| **Customer Management** |
| `/individuals` | ✅ All tenants | ✅ Own tenant | [Shared] Different data scope |
| `/businesses` | ✅ All tenants | ✅ Own tenant | [Shared] Different data scope |
| **Account Management** |
| `/accounts` | ✅ All tenants | ✅ Own tenant | [Shared] Different data scope |
| `/accounts/[id]` | ✅ Any account | ✅ Own tenant only | [Fintech Admin] Tenant isolation |
| **Transactions** |
| `/transactions/newTransaction` | ✅ Any account | ✅ Own tenant only | [Fintech Admin] Account selection limited |
| `/transactions/transactionHistory` | ✅ All tenants | ✅ Own tenant | [Shared] Different data scope |
| **ACH Processing** |
| `/ach/processing` | ✅ Originating + Receiving | ✅ Originating only | [Fintech Admin] Limited to outbound |
| `/ach/noc` | ✅ All tenants | ✅ Own tenant | [Shared] Different data scope |
| **ACH Settlement (Admin Only)** |
| `/ach/settlement` | ✅ Yes | ❌ No | [Bank Admin ONLY] |
| **Wire** |
| `/wire/processing` | ✅ All tenants | ✅ Own tenant | [Shared] Different data scope |
| **Wire Settlement (Admin Only)** |
| `/wire/settlement` | ✅ Yes | ❌ No | [Bank Admin ONLY] |
| **Compliance** |
| `/compliance/ofac` | ✅ All tenants | ✅ Own tenant | [Shared] Different data scope |
| `/compliance/314a` | ✅ All tenants | ✅ Own tenant | [Shared] Different data scope |
| `/compliance/limits` | ✅ All tenants | ✅ Own tenant | [Shared] Different data scope |
| **Configuration (Admin Only)** |
| `/configuration/programs` | ✅ Yes | ❌ No | [Bank Admin ONLY] |
| `/configuration/products` | ✅ Yes | ❌ No | [Bank Admin ONLY] |

## Feature Matrix

| Feature | Bank Admin | Fintech Admin | Test Status |
|---------|-----------|---------------|-------------|
| View customer tables | ✅ Multi-tenant | ✅ Single tenant | ✅ Implemented |
| Create transactions | ✅ Any account | ✅ Own accounts | ✅ Implemented |
| Upload ACH files | ✅ Inbound + Outbound | ✅ Outbound only | ✅ Implemented |
| ACH settlement | ✅ Yes | ❌ No | 🚧 Future |
| Program management | ✅ Yes | ❌ No | 🚧 Future |
| Product management | ✅ Yes | ❌ No | 🚧 Future |
```

---

## ⚡ EXECUTION PLAN

### Phase 1: Clean Slate ✅
```bash
# Delete obsolete documentation
rm test-automation/FINTECH-ADMIN-ROLE-UPDATE-PLAN.md
rm test-automation/api-analysis-summary.md
```

### Phase 2: Rename Test Files ✅
```bash
# Use git mv to preserve history
git mv e2e/critical-paths/01-core-workflow.spec.ts e2e/critical-paths/01-customer-management.spec.ts
git mv e2e/critical-paths/03-transactions.spec.ts e2e/critical-paths/03-transaction-creation.spec.ts

# These keep their names
# 02-account-management.spec.ts (already correct)
# 04-transaction-history.spec.ts (already correct)
# 05-ach-processing.spec.ts (already correct)
# 06-compliance.spec.ts (already correct)
```

### Phase 3: Rename Documentation Files ✅
```bash
git mv test-automation/comprehensive-coverage.md test-automation/test-coverage-by-role.md
git mv test-automation/role-based-access.md test-automation/role-access-matrix.md
```

### Phase 4: Restructure Each Test File ✅
- Add role-tagged header box
- Reorganize into `[Shared]`, `[Fintech Admin]`, `[Bank Admin]` sections
- Update console logs with role indicators
- Add `.skip()` to Bank Admin tests with TODO comments

### Phase 5: Update Documentation ✅
- Rewrite test-coverage-by-role.md with role matrix
- Rewrite role-access-matrix.md with page access table
- Update test-organization.md with role tags
- Update e2e/README.md with role architecture

### Phase 6: Verify ✅
```bash
# Run TypeScript compilation
npm run type-check

# Run tests to ensure structure works
npx playwright test --list

# Run a single test file to verify
npx playwright test e2e/critical-paths/01-customer-management.spec.ts
```

---

## ✅ SUCCESS CRITERIA

- [ ] All test files have role-tagged structure (`[Shared]`, `[Fintech Admin]`, `[Bank Admin]`)
- [ ] All test files have proper header box with role coverage
- [ ] All console logs indicate role being tested
- [ ] Bank Admin tests are properly stubbed with `.skip()` and TODO comments
- [ ] Documentation uses "role-tagged" terminology consistently
- [ ] No files reference old "fintech-admin-*" naming convention
- [ ] All tests compile without TypeScript errors
- [ ] Test execution works (even if some are skipped)

---

## 🎯 FINAL FILE STRUCTURE

```
e2e/
  critical-paths/
    01-customer-management.spec.ts       [Shared + Fintech Admin + Bank Admin (skip)]
    02-account-management.spec.ts        [Shared + Fintech Admin + Bank Admin (skip)]
    03-transaction-creation.spec.ts      [Shared + Fintech Admin + Bank Admin (skip)]
    04-transaction-history.spec.ts       [Shared + Fintech Admin + Bank Admin (skip)]
    05-ach-processing.spec.ts            [Shared + Fintech Admin + Bank Admin (skip)]
    06-compliance.spec.ts                [Shared + Fintech Admin + Bank Admin (skip)]
  
test-automation/
  test-coverage-by-role.md               [Role matrix + coverage stats]
  role-access-matrix.md                  [Page access by role]
  test-organization.md                   [Updated with role tags]
  role-architecture-proposal.md          [Foundation document - keep]
  agent-qa-plan.md                       [Original plan - keep]
```

---

**Ready to execute?** This is the complete foundation - getting it right from the start.

