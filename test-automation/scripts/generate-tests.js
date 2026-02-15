#!/usr/bin/env node

/**
 * TEST GENERATOR SCRIPT
 * 
 * This script generates Playwright test files with consistent role-tagged structure.
 * 
 * Architecture: Option A - Centralized with Role Tags
 * - [Shared] tests: Common workflows for both roles (data scope differs)
 * - [Fintech Admin] tests: Tenant-scoped validation
 * - [Bank Admin] tests: Multi-tenant features (future, stubbed with .skip())
 * 
 * Usage:
 *   npm run generate-tests             # Generate all missing files
 *   npm run generate-tests --all       # Regenerate all files (overwrites)
 *   npm run generate-tests --file 02   # Generate specific file
 * 
 * Extensibility:
 *   Add new test spec to TEST_SPECS array below
 */

const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const OUTPUT_DIR = path.join(__dirname, '../../e2e/critical-paths');
const FORCE_REGENERATE = process.argv.includes('--all');
const SPECIFIC_FILE = process.argv.find(arg => arg.startsWith('--file'))?.split('=')[1];

// ═══════════════════════════════════════════════════════════════════════════
// TEST SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════

const TEST_SPECS = [
  {
    fileNumber: '02',
    fileName: '02-account-management.spec.ts',
    feature: 'Account Management',
    pages: '/accounts, /accounts/[id]',
    description: 'Tests account table viewing, search, and account detail pages.',
    sharedTests: [
      { name: 'should load accounts table', type: 'happy' },
      { name: 'should search account by account number', type: 'happy' },
      { name: 'should navigate to account detail page', type: 'happy' },
      { name: 'should view account transactions tab', type: 'happy' },
      { name: 'should view account counterparties tab', type: 'happy' },
      { name: 'should view account limits tab', type: 'happy' },
      { name: 'should update account status (ACTIVE, FROZEN, CLOSED)', type: 'happy' },
      { name: 'should handle account not found gracefully', type: 'ugly' },
      { name: 'should show empty state when no accounts', type: 'edge' },
    ],
    fintechAdminTests: [
      { name: 'should only see own tenant accounts', description: 'Verify tenant isolation in accounts table' },
      { name: 'should not access other tenant account by ID', description: 'Verify cannot directly navigate to other tenant account' },
    ],
    bankAdminTests: [
      { name: 'should see accounts from all tenants', description: 'TODO: Verify multi-tenant account table' },
      { name: 'should filter accounts by tenant', description: 'TODO: Verify tenant filter column' },
      { name: 'should access any tenant account detail', description: 'TODO: Verify cross-tenant account access' },
    ],
  },
  {
    fileNumber: '03',
    fileName: '03-transaction-creation.spec.ts',
    feature: 'Transaction Creation',
    pages: '/transactions/newTransaction',
    description: 'Tests the new transaction form for all transaction types.',
    sharedTests: [
      { name: 'should load new transaction form', type: 'happy' },
      { name: 'should fill and submit Transfer transaction', type: 'happy' },
      { name: 'should fill and submit Credit Adjustment', type: 'happy' },
      { name: 'should fill and submit Debit Adjustment', type: 'happy' },
      { name: 'should fill and submit Domestic Wire', type: 'happy' },
      { name: 'should fill and submit International Wire', type: 'happy' },
      { name: 'should validate required fields', type: 'edge' },
      { name: 'should validate amount format', type: 'edge' },
      { name: 'should show form submission error gracefully', type: 'ugly' },
    ],
    fintechAdminTests: [
      { name: 'should only see own tenant accounts in dropdown', description: 'Verify account selection limited to own tenant' },
      { name: 'should only see own tenant counterparties', description: 'Verify counterparty selection limited to own tenant' },
      { name: 'should create transaction in own tenant', description: 'Verify submitted transaction belongs to own tenant' },
    ],
    bankAdminTests: [
      { name: 'should see accounts from all tenants in dropdown', description: 'TODO: Verify multi-tenant account selection' },
      { name: 'should create transaction for any tenant', description: 'TODO: Verify cross-tenant transaction creation' },
    ],
  },
  {
    fileNumber: '04',
    fileName: '04-transaction-history.spec.ts',
    feature: 'Transaction History',
    pages: '/transactions/transactionHistory',
    description: 'Tests transaction history table with search and filters.',
    sharedTests: [
      { name: 'should load transaction history table', type: 'happy' },
      { name: 'should search by payment ID', type: 'happy' },
      { name: 'should filter by status (POSTED)', type: 'happy' },
      { name: 'should filter by status (PENDING)', type: 'happy' },
      { name: 'should filter by status (FAILED)', type: 'happy' },
      { name: 'should filter by date range', type: 'happy' },
      { name: 'should filter by transaction type', type: 'happy' },
      { name: 'should navigate to transaction detail', type: 'happy' },
      { name: 'should apply multiple filters simultaneously', type: 'happy' },
      { name: 'should paginate through results', type: 'happy' },
      { name: 'should handle no results', type: 'edge' },
      { name: 'should show empty state when no transactions', type: 'edge' },
    ],
    fintechAdminTests: [
      { name: 'should only see own tenant transactions', description: 'Verify tenant isolation in transaction history' },
      { name: 'should search limited to own tenant', description: 'Verify payment ID search only returns own tenant results' },
    ],
    bankAdminTests: [
      { name: 'should see transactions from all tenants', description: 'TODO: Verify multi-tenant transaction table' },
      { name: 'should filter transactions by tenant', description: 'TODO: Verify tenant filter' },
      { name: 'should search across all tenants', description: 'TODO: Verify cross-tenant payment ID search' },
    ],
  },
  {
    fileNumber: '05',
    fileName: '05-ach-processing.spec.ts',
    feature: 'ACH Processing',
    pages: '/ach/processing, /ach/noc',
    description: 'Tests ACH file upload and NOC table workflows.',
    sharedTests: [
      { name: 'should load ACH processing page', type: 'happy' },
      { name: 'should view ACH file history table', type: 'happy' },
      { name: 'should view NOC table', type: 'happy' },
      { name: 'should navigate between ACH pages', type: 'happy' },
    ],
    fintechAdminTests: [
      { name: 'should upload originating ACH file', description: 'Upload outbound ACH file successfully' },
      { name: 'should validate ACH file format', description: 'Reject invalid ACH file' },
      { name: 'should NOT see Receiving option', description: 'Verify inbound ACH option hidden for Fintech Admin' },
      { name: 'should only see own tenant ACH files', description: 'Verify tenant isolation in ACH file history' },
      { name: 'should NOT access settlement page', description: 'Verify /ach/settlement is inaccessible' },
    ],
    bankAdminTests: [
      { name: 'should upload receiving ACH file', description: 'TODO: Upload inbound ACH file' },
      { name: 'should access ACH settlement page', description: 'TODO: Verify /ach/settlement is accessible' },
      { name: 'should see ACH files from all tenants', description: 'TODO: Verify multi-tenant ACH file history' },
      { name: 'should process ACH settlement', description: 'TODO: Verify settlement workflows' },
    ],
  },
  {
    fileNumber: '06',
    fileName: '06-compliance.spec.ts',
    feature: 'Compliance',
    pages: '/compliance/ofac, /compliance/314a, /compliance/limits',
    description: 'Tests compliance pages including OFAC, 314(a), and velocity limits.',
    sharedTests: [
      { name: 'should load OFAC alerts page', type: 'happy' },
      { name: 'should filter OFAC alerts by status', type: 'happy' },
      { name: 'should search OFAC alerts', type: 'happy' },
      { name: 'should navigate to OFAC alert detail', type: 'happy' },
      { name: 'should load 314(a) requests page', type: 'happy' },
      { name: 'should load Velocity Limits page', type: 'happy' },
      { name: 'should navigate between compliance pages', type: 'happy' },
      { name: 'should handle empty compliance data', type: 'edge' },
    ],
    fintechAdminTests: [
      { name: 'should only see own tenant compliance data', description: 'Verify tenant isolation in compliance' },
      { name: 'should see OFAC alerts for own customers only', description: 'Verify OFAC alerts limited to own tenant' },
      { name: 'should see velocity limits for own accounts only', description: 'Verify velocity limits limited to own tenant' },
    ],
    bankAdminTests: [
      { name: 'should see compliance data from all tenants', description: 'TODO: Verify multi-tenant compliance view' },
      { name: 'should filter compliance data by tenant', description: 'TODO: Verify tenant filter in compliance' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// TEMPLATE GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

function generateTestFile(spec) {
  const { feature, pages, description, sharedTests, fintechAdminTests, bankAdminTests } = spec;

  // Generate header box
  const header = `/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  FEATURE: ${feature.padEnd(67)}║
 * ║  Dashboard Pages: ${pages.padEnd(59)}║
 * ║                                                                           ║
 * ║  Role Coverage:                                                           ║
 * ║  ✅ [Shared] Common workflows (both Admin and Fintech Admin)             ║
 * ║  ✅ [Fintech Admin] Tenant-scoped workflows (implemented)                ║
 * ║  🚧 [Bank Admin] Multi-tenant workflows (future)                        ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 * 
 * ${description}
 * 
 * Scope:
 * - [Shared] Features that work for both roles (data scope differs)
 * - [Fintech Admin] Tenant isolation validation
 * - [Bank Admin] Cross-tenant access (future implementation)
 * 
 * Current Credentials: Fintech Admin (developer-admin)
 * Authentication: Saved in .auth/user.json
 */`;

  // Generate imports
  const imports = `
import { test, expect } from '@playwright/test';
import { testConfig } from '../test-helpers/config';
import apiClient from '../test-helpers/api-client';
import testCleanup from '../test-helpers/cleanup';`;

  // Generate [Shared] tests
  const sharedTestsCode = `
// ═══════════════════════════════════════════════════════════════════════════
// SHARED: Common workflows accessible to both roles
// ═══════════════════════════════════════════════════════════════════════════

test.describe('[Shared] ${feature} - Common UI Workflows', () => {
  
  test.beforeAll(async () => {
    console.log(\`\\n🚀 Starting [Shared] ${feature} Tests\`);
    console.log(\`🎭 Role: Both Admin & Fintech Admin\`);
    console.log(\`📍 Dashboard: \${testConfig.baseUrl}\`);
    console.log(\`🏢 Product ID: \${testConfig.productId}\\n\`);
    
    // TODO: Setup test data via API
  });

  test.afterAll(async () => {
    await testCleanup.cleanupAll();
  });
${sharedTests.map(t => `
  test('[Shared] ${t.type ? `${t.type.charAt(0).toUpperCase() + t.type.slice(1)}:` : ''} ${t.name}', async ({ page }) => {
    // TODO: Implement test
    await page.goto(testConfig.baseUrl);
    // Test implementation here
  });`).join('')}
});`;

  // Generate [Fintech Admin] tests
  const fintechAdminTestsCode = `
// ═══════════════════════════════════════════════════════════════════════════
// FINTECH ADMIN: Tenant-scoped specific validation
// ═══════════════════════════════════════════════════════════════════════════

test.describe('[Fintech Admin] ${feature} - Tenant Isolation', () => {
  
  test.beforeAll(async () => {
    console.log(\`\\n🔐 Starting [Fintech Admin] ${feature} Tenant Isolation Tests\`);
    console.log(\`🎭 Role: Fintech Admin (developer-admin)\`);
    console.log(\`🏢 Tenant Scope: Single tenant only\\n\`);
    
    // TODO: Setup test data in OUR tenant
  });

  test.afterAll(async () => {
    await testCleanup.cleanupAll();
  });
${fintechAdminTests.map(t => `
  test('[Fintech Admin] ${t.name}', async ({ page }) => {
    // ${t.description}
    // TODO: Implement tenant isolation test
    await page.goto(testConfig.baseUrl);
    // Test implementation here
  });`).join('')}
});`;

  // Generate [Bank Admin] tests (stubbed)
  const bankAdminTestsCode = `
// ═══════════════════════════════════════════════════════════════════════════
// BANK ADMIN: Multi-tenant and admin-only features (FUTURE)
// ═══════════════════════════════════════════════════════════════════════════

test.describe('[Bank Admin] ${feature} - Multi-Tenant Access', () => {
${bankAdminTests.map(t => `
  test.skip('[Bank Admin] ${t.name}', async ({ page }) => {
    // ${t.description}
    // Requires: Bank admin credentials
    // Test implementation here
  });`).join('')}
});`;

  // Combine all parts
  return `${header}${imports}

${sharedTestsCode}
${fintechAdminTestsCode}
${bankAdminTestsCode}
`;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════════════

function main() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║            TEST GENERATOR - Role-Tagged Architecture           ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  // Filter specs if specific file requested
  let specsToGenerate = TEST_SPECS;
  if (SPECIFIC_FILE) {
    specsToGenerate = TEST_SPECS.filter(spec => spec.fileNumber === SPECIFIC_FILE);
    if (specsToGenerate.length === 0) {
      console.error(`❌ Error: No test spec found for file number ${SPECIFIC_FILE}`);
      process.exit(1);
    }
  }

  let generatedCount = 0;
  let skippedCount = 0;

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate each test file
  for (const spec of specsToGenerate) {
    const outputPath = path.join(OUTPUT_DIR, spec.fileName);
    const exists = fs.existsSync(outputPath);

    // Skip if file exists and not forcing regeneration
    // Exception: Always allow file 01 to be regenerated since it's the template
    if (exists && !FORCE_REGENERATE && spec.fileNumber !== '01') {
      console.log(`⏭️  Skipping ${spec.fileName} (already exists)`);
      skippedCount++;
      continue;
    }

    // Generate file content
    const content = generateTestFile(spec);
    
    // Write file
    fs.writeFileSync(outputPath, content, 'utf8');
    
    const action = exists ? 'Regenerated' : 'Generated';
    console.log(`✅ ${action}: ${spec.fileName}`);
    console.log(`   Feature: ${spec.feature}`);
    console.log(`   Shared: ${spec.sharedTests.length} tests`);
    console.log(`   Fintech Admin: ${spec.fintechAdminTests.length} tests`);
    console.log(`   Bank Admin: ${spec.bankAdminTests.length} tests (stubbed)\n`);
    
    generatedCount++;
  }

  // Summary
  console.log('─────────────────────────────────────────────────────────────────');
  console.log(`✨ Generation complete!`);
  console.log(`   Generated: ${generatedCount} file(s)`);
  console.log(`   Skipped: ${skippedCount} file(s)`);
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log('─────────────────────────────────────────────────────────────────\n');

  console.log('📋 Next steps:');
  console.log('   1. Review generated test files');
  console.log('   2. Implement test logic (marked with TODO comments)');
  console.log('   3. Run: npx playwright test --list (verify compilation)');
  console.log('   4. Run: npx playwright test (execute tests)\n');
}

// Run generator
if (require.main === module) {
  main();
}

module.exports = { generateTestFile, TEST_SPECS };
