# Test Suite Role Architecture - Proposal

## Overview

This document proposes a **centralized test structure** that accounts for both **Bank Admin** and **Fintech Admin** roles, with clear role-based separation within test files.

## Role Definitions

### Bank Admin (ADMIN_ROUTE)
- **Purpose:** Bank operations team managing platform infrastructure
- **Scope:** Multi-tenant (all tenants/products)
- **Cognito Groups:** `admin-admin`, `admin-ops`, `admin-compliance`, `admin-readonly`
- **Unique Access:**
  - ACH/Wire settlement approval
  - Program and product configuration
  - Cross-tenant operations
  - Reconciliation workflows

### Fintech Admin (DEVELOPER_ROUTE, Tenant-Scoped)
- **Purpose:** Fintech company managing their customer operations
- **Scope:** Single tenant (isolated by tenantId)
- **Cognito Groups:** `developer-admin`, `developer-ops`, `developer-readonly`
- **Access:**
  - Customer management (their tenant only)
  - Account management (their tenant only)
  - Transaction creation and history (their tenant only)
  - ACH originating file upload (outbound only)
  - Compliance monitoring (their tenant only)

### Shared Features
Features accessible to **both** roles with scope differences:
- Customer tables (Bank: all tenants, Fintech: single tenant)
- Account management (Bank: all accounts, Fintech: tenant accounts)
- Transaction creation (Bank: any account, Fintech: tenant accounts)
- Compliance monitoring (Bank: all, Fintech: tenant-specific)

## Proposed Test Structure

### File Organization ✅ RECOMMENDED

```
e2e/critical-paths/
  01-customer-management.spec.ts        [Shared + Fintech Admin focus]
  02-account-management.spec.ts         [Shared + Fintech Admin focus]
  03-transaction-creation.spec.ts       [Shared + Fintech Admin focus]
  04-transaction-history.spec.ts        [Shared + Fintech Admin focus]
  05-ach-processing.spec.ts             [Fintech Admin + Bank Admin differentiation]
  06-compliance.spec.ts                 [Shared + Fintech Admin focus]
  07-settlement-operations.spec.ts      [Bank Admin ONLY - future]
  08-program-management.spec.ts         [Bank Admin ONLY - future]
```

### Test Block Structure

Each test file uses **role-tagged describe blocks**:

```typescript
/**
 * Customer Management Dashboard Tests
 * 
 * Role Coverage:
 * - ✅ [Shared] Common workflows for both Admin and Fintech Admin
 * - ✅ [Fintech Admin] Tenant-scoped workflows (implemented)
 * - 🚧 [Bank Admin] Multi-tenant workflows (future, requires admin credentials)
 */

import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════════════════════════════════════
// SHARED: Features accessible to both roles (scope differs)
// ═══════════════════════════════════════════════════════════════════════

test.describe('[Shared] Customer Management - Common UI Workflows', () => {
  
  test.beforeAll(async () => {
    // Setup using current credentials (fintech admin)
  });

  test('should load customers table', async ({ page }) => {
    // Test works for both roles (results differ by tenant scope)
  });

  test('should navigate to customer detail page', async ({ page }) => {
    // Common workflow
  });
});

// ═══════════════════════════════════════════════════════════════════════
// FINTECH ADMIN: Tenant-scoped specific tests
// ═══════════════════════════════════════════════════════════════════════

test.describe('[Fintech Admin] Customer Management - Tenant Isolation', () => {
  
  test('should only see customers from own tenant', async ({ page }) => {
    // Create customer in our tenant
    // Verify it appears in table
    // Verify we don't see other tenants' customers
  });

  test('should not access other tenant customer details', async ({ page }) => {
    // Try to access customer ID from different tenant
    // Should fail or show error
  });
});

// ═══════════════════════════════════════════════════════════════════════
// BANK ADMIN: Multi-tenant specific tests (FUTURE)
// ═══════════════════════════════════════════════════════════════════════

test.describe('[Bank Admin] Customer Management - Multi-Tenant', () => {
  
  test.skip('should see customers from all tenants', async ({ page }) => {
    // TODO: Implement when bank admin credentials available
    // Login as bank admin
    // Verify can see customers across multiple tenants
    // Verify tenant column shows different tenant IDs
  });

  test.skip('should filter customers by tenant', async ({ page }) => {
    // TODO: Implement when bank admin credentials available
    // Apply tenant filter
    // Verify results limited to selected tenant
  });
});
```

## Test Naming Conventions

### Test Description Format:

```typescript
// Shared features (both roles can access)
test('[Shared] should load accounts table', async ({ page }) => {});

// Fintech Admin specific (tenant-scoped)
test('[Fintech Admin] should only see own tenant accounts', async ({ page }) => {});

// Bank Admin specific (future)
test.skip('[Bank Admin] should see all tenant accounts', async ({ page }) => {});
```

### Role Tags:
- `[Shared]` - Works for both roles (may show different data based on scope)
- `[Fintech Admin]` - Tenant-scoped feature or validation
- `[Bank Admin]` - Multi-tenant feature or admin-only access
- `[Bank Admin ONLY]` - Feature not accessible to Fintech Admin at all

## Current Implementation Status

### Phase 1: ✅ Fintech Admin Focus (Current)
**Status:** In Progress  
**Credentials:** Available (developer-admin)  
**Scope:** Test features accessible to Fintech Admin

**Files:**
- ✅ 01-customer-management.spec.ts (customers table, detail pages)
- ✅ 02-account-management.spec.ts (accounts table, detail, status)
- ✅ 03-transaction-creation.spec.ts (new transaction form)
- ✅ 04-transaction-history.spec.ts (transaction filters, search)
- ✅ 05-ach-processing.spec.ts (originating file upload, NOC table)
- ✅ 06-compliance.spec.ts (OFAC, 314a, limits)

**Test Focus:**
- Verify UI loads and functions correctly
- Verify tenant isolation (don't see other tenant data)
- Verify permissions (can't access admin-only features)

### Phase 2: 🚧 Bank Admin Tests (Future)
**Status:** Planned  
**Credentials:** Not yet available  
**Scope:** Test admin-only features and multi-tenant access

**Files to Add:**
- 🚧 07-settlement-operations.spec.ts (ACH/Wire settlement approval)
- 🚧 08-program-management.spec.ts (program/product configuration)
- 🚧 09-reconciliation.spec.ts (recon file upload, exception review)

**Tests to Add to Existing Files:**
- Add `[Bank Admin]` blocks to existing files
- Test cross-tenant data access
- Test admin-only UI features

## Documentation Structure

### Centralized Documentation Files:

1. **test-coverage.md** (replaces comprehensive-coverage.md)
   ```markdown
   # Test Coverage by Role
   
   ## Shared Features (Both Roles)
   - Customer management (tenant-scoped)
   - Account management
   - ...
   
   ## Fintech Admin Specific
   - Tenant isolation validation
   - ...
   
   ## Bank Admin Specific
   - Settlement workflows
   - Program management
   - ...
   ```

2. **role-access-matrix.md** (replaces role-based-access.md)
   ```markdown
   | Feature | Bank Admin | Fintech Admin | Notes |
   |---------|-----------|---------------|-------|
   | View customers | ✅ All tenants | ✅ Own tenant | Scope differs |
   | ACH settlement | ✅ Yes | ❌ No | Admin-only |
   | Programs | ✅ Yes | ❌ No | Admin-only |
   ```

3. **test-organization.md** (update existing)
   - Add role-based sections
   - Document test tagging convention
   - Explain shared vs role-specific tests

## Configuration Updates

### playwright.config.ts

```typescript
export default defineConfig({
  testDir: './e2e',
  
  // Projects for different roles
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'fintech-admin',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: '.auth/fintech-admin.json',
      },
      dependencies: ['setup'],
      testMatch: /.*\.spec\.ts/,
      grep: /@fintech-admin|@shared/,  // Run [Fintech Admin] and [Shared] tests
    },
    {
      name: 'bank-admin',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: '.auth/bank-admin.json',
      },
      dependencies: ['setup'],
      testMatch: /.*\.spec\.ts/,
      grep: /@bank-admin|@shared/,  // Run [Bank Admin] and [Shared] tests
    },
  ],
});
```

### auth.setup.ts (multiple auth files)

```typescript
// auth.fintech-admin.setup.ts
test('authenticate as fintech admin', async ({ page }) => {
  // Login with developer credentials
  await page.context().storageState({ path: '.auth/fintech-admin.json' });
});

// auth.bank-admin.setup.ts (future)
test('authenticate as bank admin', async ({ page }) => {
  // Login with admin credentials
  await page.context().storageState({ path: '.auth/bank-admin.json' });
});
```

## Benefits of This Approach

### ✅ Advantages:

1. **Single Source of Truth**
   - One test file per feature domain
   - Clear role-based sections
   - No duplicate test logic

2. **Progressive Enhancement**
   - Start with Fintech Admin tests (current credentials)
   - Add Bank Admin tests later (when credentials available)
   - Shared tests benefit both roles

3. **Clear Role Boundaries**
   - `[Shared]` tag shows common functionality
   - `[Fintech Admin]` shows tenant-scoped behavior
   - `[Bank Admin]` shows admin-only features

4. **Easier Maintenance**
   - Update shared logic once
   - Role-specific logic isolated
   - Easy to skip unavailable tests

5. **Better Coverage Visibility**
   - See all feature coverage in one place
   - Identify gaps per role
   - Track implementation progress

### ⚠️ Considerations:

1. **Test File Size**
   - Each file may be larger with multiple role sections
   - Solution: Keep focused on feature domain, split if needed

2. **Credential Management**
   - Need separate auth files per role
   - Solution: Multiple .setup.ts files

3. **Test Execution Time**
   - Running both roles doubles test time
   - Solution: Use Playwright projects to run selectively

## Migration Path

### Immediate Actions (Complete Role Clarity):

1. **Rename test blocks with role tags:**
   ```typescript
   // Old
   test.describe('Accounts Dashboard UI Tests', () => {
   
   // New
   test.describe('[Shared] Accounts Dashboard - Common Workflows', () => {
   test.describe('[Fintech Admin] Accounts - Tenant Isolation', () => {
   test.describe('[Bank Admin] Accounts - Multi-Tenant', () => {
   ```

2. **Update file headers:**
   ```typescript
   /**
    * Account Management Tests
    * 
    * Role Coverage:
    * - ✅ [Shared] Implemented with fintech admin credentials
    * - ✅ [Fintech Admin] Tenant-scoped validation implemented
    * - 🚧 [Bank Admin] Multi-tenant features (future)
    */
   ```

3. **Update documentation:**
   - Rename comprehensive-coverage.md → test-coverage-by-role.md
   - Add role matrix table
   - Document test tagging convention

4. **Keep current file names (no "fintech-admin" prefix):**
   - `01-customer-management.spec.ts` (not 01-fintech-admin-customer-management.spec.ts)
   - Files cover all roles, differentiated by test blocks

### Future Actions (When Bank Admin Credentials Available):

1. Add `[Bank Admin]` test blocks to existing files
2. Create admin-only test files (settlement, programs)
3. Set up separate authentication for bank admin
4. Configure Playwright projects for role-based execution

## Success Criteria

✅ Test files have clear `[Shared]`, `[Fintech Admin]`, `[Bank Admin]` sections  
✅ File names are role-agnostic (represent feature domain)  
✅ Documentation clearly explains role coverage  
✅ Tests execute with current Fintech Admin credentials  
✅ Bank Admin tests are stubbed with `.skip()` for future implementation  
✅ Role-based Playwright projects configured  
✅ Clear migration path defined

## Questions to Resolve

1. **Should we implement Playwright projects now or later?**
   - Now: More setup, but better organization
   - Later: Simpler for current single-role testing

2. **Should Bank Admin stubs be added now or when needed?**
   - Now: Shows complete feature coverage map
   - Later: Less noise in current implementation

3. **File naming convention?**
   - Current proposal: `01-customer-management.spec.ts` (feature-based, no role prefix)
   - Alternative: Keep role prefix for clarity? `01-fintech-admin-customer-management.spec.ts`

---

**Recommendation:** Adopt **centralized structure with role tags**, keep **feature-based file names**, implement **Fintech Admin tests now**, stub **Bank Admin tests** with clear `.skip()` messages for future.

