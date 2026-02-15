# Test Generator - Usage Guide

## Overview

The test generator script creates Playwright test files with consistent role-tagged architecture following **Option A: Centralized with Role Tags**.

## Quick Start

```bash
# Generate all missing test files
npm run generate-tests

# Regenerate all files (overwrites existing)
npm run generate-tests --all

# Generate specific file
npm run generate-tests --file=02
```

## Architecture

Each generated test file follows this structure:

```
┌─────────────────────────────────────┐
│  Feature Header                      │
│  - Role coverage indicators          │
│  - Pages tested                      │
└─────────────────────────────────────┘

[Shared] Tests
├─ Common workflows for both roles
├─ UI and navigation tests
└─ Works for Admin & Fintech Admin

[Fintech Admin] Tests
├─ Tenant isolation validation
├─ Tenant-scoped data checks
└─ Access restrictions

[Bank Admin] Tests (Future)
├─ Multi-tenant features (stubbed)
├─ Admin-only features (stubbed)
└─ Uses test.skip() until credentials available
```

## Adding New Test Files

1. **Edit** `test-automation/scripts/generate-tests.js`
2. **Add** new spec to `TEST_SPECS` array:

```javascript
{
  fileNumber: '07',
  fileName: '07-new-feature.spec.ts',
  feature: 'New Feature',
  pages: '/new-feature',
  description: 'Tests new feature workflows.',
  sharedTests: [
    { name: 'should load page', type: 'happy' },
    { name: 'should handle error', type: 'ugly' },
  ],
  fintechAdminTests: [
    { name: 'should verify tenant isolation', description: 'Check tenant scope' },
  ],
  bankAdminTests: [
    { name: 'should see all tenants', description: 'TODO: Multi-tenant view' },
  ],
}
```

3. **Run** `npm run generate-tests`

## Test Types

### Shared Tests
- **happy**: Normal workflow success cases
- **edge**: Boundary conditions and edge cases
- **ugly**: Error handling and graceful failures

### Role-Specific Tests
- **Fintech Admin**: Tenant isolation and access restrictions
- **Bank Admin**: Multi-tenant and admin-only features

## Benefits for Teams

### For Developers
✅ Consistent test structure across all files  
✅ No manual copy-paste errors  
✅ Clear role separation from the start  
✅ Easy to add new test files

### For CI/CD
✅ Can validate test structure programmatically  
✅ Can regenerate tests in build pipeline  
✅ Version controlled test definitions  
✅ Reproducible test scaffolding

### For Code Reviews
✅ Test structure is enforced by generator  
✅ Changes to structure are visible in git  
✅ Role coverage is explicit and documented  
✅ Easy to spot missing test cases

## Generated Files

Current test files (all 6):
- ✅ `01-customer-management.spec.ts` - Individuals, businesses tables
- ✅ `02-account-management.spec.ts` - Accounts table and details
- ✅ `03-transaction-creation.spec.ts` - New transaction form
- ✅ `04-transaction-history.spec.ts` - Transaction history table
- ✅ `05-ach-processing.spec.ts` - ACH upload and NOC
- ✅ `06-compliance.spec.ts` - OFAC, 314a, velocity limits

## Script Location

- **Script**: `test-automation/scripts/generate-tests.js`
- **Output**: `e2e/critical-paths/*.spec.ts`
- **NPM Command**: `npm run generate-tests`

## Verification

After generation, verify compilation:

```bash
# List all tests (checks TypeScript compilation)
npx playwright test --list

# Run tests (requires .env.local setup)
npx playwright test
```

## Extending the Generator

The generator is modular and can be extended:

### Custom Templates
Modify `generateTestFile()` function to change template structure

### Custom Test Types
Add new test type categories beyond happy/edge/ugly

### Integration with Other Tools
Export `TEST_SPECS` for use in documentation generators, test reports, etc.

### Validation
Add pre-generation validation (e.g., check for duplicate file numbers)

## Example: Generate Documentation

```javascript
// Can import and use TEST_SPECS in other scripts
const { TEST_SPECS } = require('./generate-tests');

// Generate coverage matrix
TEST_SPECS.forEach(spec => {
  console.log(`${spec.feature}: ${spec.sharedTests.length} shared tests`);
});
```

## Troubleshooting

### File Already Exists
Use `--all` flag to force regeneration:
```bash
npm run generate-tests --all
```

### Missing Environment Variables
Normal during generation. Tests won't run until `.env.local` is configured.

### TypeScript Errors
Check imports in generated files. All imports should resolve to existing modules.

## Integration with Testing Infrastructure

### Pre-commit Hook
```bash
# Validate test structure before commit
npm run generate-tests --validate
```

### CI Pipeline
```bash
# Verify generated files match specs
npm run generate-tests --dry-run
git diff --exit-code e2e/critical-paths/
```

### Test Coverage Reports
Use TEST_SPECS to generate coverage matrices automatically

---

**This generator is the foundation for scalable, consistent test infrastructure.** 🚀
