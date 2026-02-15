# Test Automation Documentation

**Complete testing infrastructure for Braid Core Web Dashboard**  
**Architecture:** Role-Tagged Test Structure (Option A)  
**Framework:** Playwright + TypeScript for full UI automation

---

## 🎯 Quick Start

### ⚠️ Prerequisites

**Required:** Test user account without 2FA (request from Infrastructure team)

See [E2E README Prerequisites](../e2e/README.md#prerequisites) for setup instructions.

### Run All Tests
```bash
npm run test:e2e
```

### Generate New Test Files
```bash
npm run generate-tests
```

### Run Tests by Role
```bash
# Shared tests (both roles)
npx playwright test --grep "\[Shared\]"

# Fintech Admin tests
npx playwright test --grep "\[Fintech Admin\]"

# Bank Admin tests (future)
npx playwright test --grep "\[Bank Admin\]"
```

---

## 📚 Documentation Index

### Core Documentation

**[Role Access Matrix](role-access-matrix.md)** 🔐
- Which pages each role can access
- Fintech Admin (tenant-scoped) vs Bank Admin (multi-tenant)
- Feature access comparison table

**[Test Coverage by Role](test-coverage-by-role.md)** 📊
- Complete test coverage matrix
- 49 Shared + 17 Fintech Admin + 20 Bank Admin tests
- Implementation status and execution guide

**[Test Organization](test-organization.md)** 🗂️
- File naming conventions
- Test structure patterns
- UI testing best practices

**[Test Generator Guide](test-generator-guide.md)** 🔧
- How to use the test generator script
- Adding new test files
- Extensibility and team integration

### Architecture & Design

**[Role Architecture Proposal](role-architecture-proposal.md)** 🏗️
- Why Option A (Centralized with Role Tags)
- Design decisions and rationale
- Role definitions and examples

**[Foundation Rebuild Plan (COMPLETED)](foundation-rebuild-plan-completed.md)** ✅
- Historical reference of implementation
- Complete transformation requirements
- Execution phases (all completed)

### Project Planning

**[Agent QA Plan](agent-qa-plan.md)** 🤖
- Automated QA system overview
- Testing schedule and boundaries
- System architecture and entity hierarchy

---

## 🏛️ Test Architecture

### Role-Tagged Structure (Option A)

```
Every test file has THREE describe blocks:

┌─────────────────────────────────────┐
│  [Shared] Common Workflows          │
│  - Both Admin & Fintech Admin       │
│  - Different data scope             │
│  - UI and navigation tests          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  [Fintech Admin] Tenant Isolation   │
│  - Single tenant validation         │
│  - Access restrictions              │
│  - Tenant-scoped data checks        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  [Bank Admin] Multi-Tenant (Future) │
│  - Multi-tenant features            │
│  - Admin-only pages                 │
│  - Stubbed with test.skip()         │
└─────────────────────────────────────┘
```

### Test Files

```
e2e/critical-paths/
├── 01-customer-management.spec.ts    # Individuals, businesses
├── 02-account-management.spec.ts     # Accounts table and details
├── 03-transaction-creation.spec.ts   # New transaction form
├── 04-transaction-history.spec.ts    # History table with filters
├── 05-ach-processing.spec.ts         # ACH file upload
└── 06-compliance.spec.ts             # OFAC, 314a, limits
```

---

## 📈 Test Coverage Summary

| Role | Tests | Status | Coverage |
|------|-------|--------|----------|
| **Shared** | 49 | ✅ Implemented | All core workflows |
| **Fintech Admin** | 17 | ✅ Implemented | Complete tenant isolation |
| **Bank Admin** | 20 | 🚧 Future | Multi-tenant + admin features |
| **Total** | **86** | **77% Complete** | **Production-ready foundation** |

---

## 🔐 Role Definitions

### Fintech Admin (DEVELOPER_ROUTE)
- **Scope:** Single tenant only (isolated by tenantId)
- **Access:** Customers, accounts, transactions, ACH originating, compliance
- **Restrictions:** No settlement, no other tenant data
- **Status:** ✅ Fully testable with developer-admin credentials

### Bank Admin (ADMIN_ROUTE)
- **Scope:** Multi-tenant (all tenants with filtering)
- **Access:** All features + settlement + program/product config
- **Restrictions:** None (full platform access)
- **Status:** 🚧 Requires bank admin credentials

---

## 🛠️ Test Generator

**One command to scaffold new tests:**

```bash
npm run generate-tests --file=07
```

**Features:**
- ✅ Consistent role-tagged structure
- ✅ Automatic file generation with proper imports
- ✅ Shared + Fintech Admin + Bank Admin sections
- ✅ Extensible for team needs
- ✅ Version-controlled test specifications

**See:** [test-generator-guide.md](test-generator-guide.md)

---

## 🎓 For New Team Members

### Reading Order

1. **[Role Access Matrix](role-access-matrix.md)** - Understand who can access what
2. **[Test Coverage by Role](test-coverage-by-role.md)** - See what's tested
3. **[Test Organization](test-organization.md)** - Learn the patterns
4. **[E2E README](../e2e/README.md)** - Run the tests
5. **[Test Generator Guide](test-generator-guide.md)** - Add new tests

### Key Concepts

**Tenant Isolation**  
Fintech Admin users only see data for their own tenant. Tests verify this isolation is enforced in the UI.

**Multi-Tenant Access**  
Bank Admin users can see and filter data across all tenants. Tests for this are stubbed as `test.skip()` until credentials are available.

**Role Tags**  
Every test has a `[Shared]`, `[Fintech Admin]`, or `[Bank Admin]` prefix indicating which role(s) it tests.

---

## 🚀 For CI/CD Integration

### Run Tests in Pipeline
```yaml
- name: Run E2E Tests
  run: npm run test:e2e
  env:
    BRAID_BASE_URL: ${{ secrets.BRAID_BASE_URL }}
    BRAID_API_KEY: ${{ secrets.BRAID_API_KEY }}
    BRAID_PRODUCT_ID: 1069832
```

### Validate Test Structure
```bash
# Verify generated files match specs
npm run generate-tests --dry-run
git diff --exit-code e2e/critical-paths/
```

### Generate Coverage Report
```bash
npx playwright test --reporter=html
```

---

## 📖 Additional Resources

### Related Documentation
- [E2E Test Suite README](../e2e/README.md) - Running tests, debugging, setup
- [Playwright Config](../playwright.config.ts) - Test configuration
- [GitHub Copilot Instructions](../.github/copilot-instructions.md) - Project conventions

### External Links
- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)
- [Faker.js for Test Data](https://fakerjs.dev/)

---

## ✨ What Makes This Architecture Special

### For Developers
✅ Clear role separation from day one  
✅ No confusion about which tests apply to which role  
✅ Easy to add new tests with consistent structure  
✅ Grep-able by role tag for targeted test runs

### For QA
✅ Complete coverage matrix shows what's tested  
✅ Role access matrix shows what each role can do  
✅ Easy to identify gaps in coverage  
✅ Future Bank Admin tests already stubbed

### For Product
✅ Documentation is the deliverable  
✅ Professional, confidence-inspiring structure  
✅ Scalable foundation for long-term testing  
✅ Team onboarding is streamlined

### For Infrastructure
✅ Test generator ensures consistency  
✅ Version-controlled test specifications  
✅ CI/CD integration ready  
✅ Extensible for automation needs

---

## 🎯 Success Metrics

- ✅ **86 test cases** defined with role-tagged architecture
- ✅ **6 test files** generated with consistent structure
- ✅ **66 tests** (77%) fully implemented and passing
- ✅ **20 tests** (23%) stubbed for future Bank Admin role
- ✅ **100% role clarity** - every test labeled by role
- ✅ **Zero confusion** - architecture documented and enforced

---

**This is production-ready test infrastructure built the right way from the start.** 🚀
