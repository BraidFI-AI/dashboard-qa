# Agent QA Plan - Automated Testing System

## Overview

Automated testing system with two independent workflows running daily during off-hours. AI agents analyze results, generate reports, and create Jira tickets for failures. **All analysis is read-only - agents never modify code.**

**Note:** Unit testing is handled by developers as part of their development workflow and is excluded from this automated QA system.

---

## Rules of Engagement

### Testing Schedule
- **UI Tests**: Daily at 2:00 AM UTC (~8-10 min)  
- **Integration (E2E) Tests**: Daily at 2:30 AM UTC (~25-30 min)
- **Daily Digest**: 3:00 AM UTC (after all tests complete)

### AI Agent Boundaries
✅ **What AI Agents DO:**
- Analyze test results
- Generate summary reports
- Create Jira tickets for failures
- Identify patterns and trends
- Suggest investigation approaches

❌ **What AI Agents NEVER DO:**
- Modify production code
- Modify test code
- Commit changes to repository
- Auto-fix failures

### Output Commitments
- Machine-readable test results (JSON)
- Executive summary report (HTML + JSON)
- Automated Jira tickets for critical failures
- Morning digest email to engineering team

---

## System Architecture

### How the Dashboard Communicates with Braid

**Dashboard → REST API → Braid Backend** (NOT direct controller access)

```
Next.js Dashboard (Browser)
  ↓ HTTP/REST
ApiClient (Axios + JWT auth)
  ↓ HTTP/REST  
Braid API (api.test.braid.zone)
  ↓
Backend Services + Database
```

**Technical Details:**
- **Communication**: Standard HTTP REST API calls via Axios
- **Authentication**: AWS Cognito JWT tokens (auto-injected by ApiClient interceptor)
- **API Base URL**: Configured in `url.json` (generated from template)
  - Test env: `https://api.test.braid.zone`
  - Dev env: `https://api.dev.braid.zone`
  - Local: `http://localhost:8080`
- **Endpoints**: `/program`, `/product`, `/account`, `/transaction`, `/ach`, `/wire`, `/OFAC`, etc.

**Entity Hierarchy:** (from OpenAPI spec)
```
Program (root entity)
  ↓ (programId foreign key)
Product
  ↓ (productId foreign key)
Account ←─── (customerId foreign key) ───┐
  ↓ (accountNumber reference)              │
Transaction ←─ (counterpartyId FK) ─→ Counterparty
                                          │
Customer (Individual or Business) ────────┘
```

**Key Relationships:**
- **Program → Product**: Products belong to Programs (`productId` references `programId`)
- **Product → Account**: Accounts belong to Products (`accountId` references `productId`)
- **Customer → Account**: Accounts owned by Customers (`accountId` references `customerId`)
- **Account → Transaction**: Transactions debit/credit Accounts (via `accountNumber`)
- **Counterparty → Transaction**: ACH/Wire transactions require Counterparty (`counterpartyId`)

**Critical API Endpoints:** (110 total endpoints)
- **Accounts**: `GET /account`, `GET /account/{accountNumber}`, `PUT /account/{accountNumber}/status`
- **Transactions**: `POST /transaction/ach/push`, `POST /transaction/ach/pull`, `POST /transaction/wire/outbound`, `POST /transaction/internal/transfer`, `POST /transaction/search`
- **Customers**: `POST /individual`, `GET /individual/{id}`, `POST /business`, `GET /business/{id}`
- **Counterparties**: `POST /counterparty`, `GET /counterparty/{id}`, `POST /counterparty/search`
- **Compliance**: `POST /alerts/search`, `GET /alerts/{alertId}`, `PUT /alerts/{alertId}`
- **ACH Files**: `POST /ach/load/outbound`, `GET /ach/file/status/v2`
- **Simulations**: `POST /simulation/ach/inbound`, `POST /simulation/wire/inbound`

### Test Data Strategy

**Approach: Dedicated Test Grouping** (based on OpenAPI spec entity requirements)

Maintain stable test entities that satisfy API foreign key dependencies:

```
Test Program (id: 1001)
  └→ programId referenced by Products

Test Products (productId required for Accounts)
  ├─→ CI_Checking (id: 2001, programId: 1001)
  ├─→ CI_Savings (id: 2002, programId: 1001)
  └─→ CI_Wire (id: 2003, programId: 1001)

Test Customers (customerId required for Accounts)
  Individuals:
    ├─→ John TestUser (id: 3001, email: john.test@citest.braid.zone)
    ├─→ Sarah HighVolume (id: 3002, email: sarah.highvolume@citest.braid.zone)
    └─→ Jane ZeroBalance (id: 3003, email: jane.zero@citest.braid.zone)
  Businesses:
    ├─→ Test Corp LLC (id: 4001, ein: 99-9990001)
    └─→ HighVolume Inc (id: 4002, ein: 99-9990002)

Test Accounts (productId + customerId → creates Account)
  ├─→ CITEST_CHK_001 (id: 5001, customerId: 3001, productId: 2001, balance: $10,000)
  ├─→ CITEST_CHK_002 (id: 5002, customerId: 3002, productId: 2001, balance: $100,000)
  ├─→ CITEST_CHK_003 (id: 5003, customerId: 3003, productId: 2001, balance: $0)
  ├─→ CITEST_SAV_001 (id: 5004, customerId: 3001, productId: 2002, balance: $50,000)
  ├─→ CITEST_BUS_001 (id: 5005, customerId: 4001, productId: 2001, balance: $25,000)
  └─→ CITEST_WIRE_001 (id: 5006, customerId: 3002, productId: 2003, balance: $75,000)

Test Counterparties (counterpartyId required for ACH/Wire transactions)
  ├─→ ACH_VENDOR_001 (id: 6001, routingNumber: 121000248, accountNumber: 999111111)
  ├─→ Wire_International (id: 6002, swiftCode: CHASUS33, iban: US12345...)
  ├─→ Blocked_Counterparty (id: 6003, status: BLOCKED)
  └─→ Standard_ACH (id: 6004, routingNumber: 026009593)
    └── Fee Schedules: Standard test rates
```

**Test Manifest File:** `test-grouping-manifest.json` (API-compliant structure)
```json
{
  "program": {
    "id": 1001,
    "name": "CI_TEST_PROGRAM"
  },
  "products": {
    "checking": {"id": 2001, "programId": 1001, "name": "CI_Checking", "type": "CHECKING"},
    "savings": {"id": 2002, "programId": 1001, "name": "CI_Savings", "type": "SAVINGS"},
    "wire": {"id": 2003, "programId": 1001, "name": "CI_Wire", "type": "CHECKING"}
  },
  "customers": {
    "john_testuser": {
      "id": 3001,
      "type": "INDIVIDUAL",
      "firstName": "John",
      "lastName": "TestUser",
      "email": "john.test@citest.braid.zone"
    },
    "sarah_highvolume": {
      "id": 3002,
      "type": "INDIVIDUAL", 
      "firstName": "Sarah",
      "lastName": "HighVolume",
      "email": "sarah.highvolume@citest.braid.zone"
    },
    "test_corp": {
      "id": 4001,
      "type": "BUSINESS",
      "legalName": "Test Corp LLC",
      "ein": "99-9990001",
      "email": "corp@citest.braid.zone"
    }
  },
  "accounts": {
    "checking_funded": {
      "id": 5001,
      "accountNumber": "CITEST_CHK_001",
      "customerId": 3001,
      "productId": 2001,
      "accountType": "CHECKING",
      "status": "ACTIVE",
      "balance": 10000.00
    },
    "checking_high_balance": {
      "id": 5002,
      "accountNumber": "CITEST_CHK_002",
      "customerId": 3002,
      "productId": 2001,
      "accountType": "CHECKING",
      "status": "ACTIVE",
      "balance": 100000.00
    },
    "checking_zero": {
      "id": 5003,
      "accountNumber": "CITEST_CHK_003",
      "customerId": 3003,
      "productId": 2001,
      "accountType": "CHECKING",
      "status": "ACTIVE",
      "balance": 0.00
    },
    "savings_funded": {
      "id": 5004,
      "accountNumber": "CITEST_SAV_001",
      "customerId": 3001,
      "productId": 2002,
      "accountType": "SAVINGS",
      "status": "ACTIVE",
      "balance": 50000.00
    }
  },
  "counterparties": {
    "ach_vendor": {
      "id": 6001,
      "name": "Test Vendor ACH",
      "routingNumber": "121000248",
      "accountNumber": "999111111",
      "type": "BUSINESS"
    },
    "wire_international": {
      "id": 6002,
      "name": "International Wire Recipient",
      "swiftCode": "CHASUS33",
      "iban": "US64SVBKUS6S3300400000"
    }
  }
}
```

**API Compliance Notes:**
- All IDs match API integer format (not strings)
- Account types: `CHECKING` or `SAVINGS` (per OpenAPI enum)
- Account statuses: `ACTIVE`, `BLOCKED`, `INACTIVE`, `CLOSED` (per OpenAPI enum)
- Customer types: `INDIVIDUAL` or `BUSINESS`
- Counterparty fields match API requirements for ACH/Wire transactions

**Tests reference stable entities:**
```typescript
import manifest from '../test-grouping-manifest.json'

test('create ACH push transaction', async ({ page }) => {
  const account = manifest.accounts.checking_funded
  const counterparty = manifest.counterparties.ach_vendor
  
  // Dashboard makes POST /transaction/ach/push with:
  // { accountNumber: "CITEST_CHK_001", counterpartyId: 6001, amount: 100.00, ... }
  await page.fill('[name="accountNumber"]', account.accountNumber)
  await page.fill('[name="accountNumber"]', account.accountNumber)
  // Account already exists with $10,000 balance
})
```

**Test Data Lifecycle:**
1. **One-time setup** (manual): Create test program/products/accounts in Braid test API
2. **Before each test run**: Reset account balances via API, delete test transactions
3. **During tests**: Dashboard creates transactions/operations via UI
4. **After tests**: State automatically reset for next run

**Why This Works:**
- Dashboard only tests **user-initiated actions** (no external webhooks/batch jobs)
- All state changes are **dashboard-controlled** (predictable sequencing)
- **No race conditions** from external activity
- Tests hit **real Braid test API** (required - dashboard makes HTTP calls)

---

## The Two Workflows

**Note:** Unit testing is handled by developers as part of their development workflow and is not included in this automated QA system.

---

### Workflow 1: UI Tests
**What it tests:** React components with mocked APIs  
**Technology:** Vitest + React Testing Library + MSW  
**API Strategy:** Mock Service Worker intercepts all HTTP requests  
**Speed:** Medium (~8-10 minutes)

**Coverage:**
- Reusable components ([src/core/components/](src/core/components/))
- Feature components ([src/app/*/components/](src/app/))
- Form interactions (typing, clicking, validation)
- Loading/error/empty states
- Role-based access control

**Target:** 70% component coverage minimum

---

### Workflow 2: Integration (E2E) Tests
**What it tests:** Complete user journeys against real Braid test API  
**Technology:** Playwright with Chromium  
**API Strategy:** Real HTTP calls to Braid test environment  
**Speed:** Slower (~25-30 minutes)

**Coverage - Critical Dashboard Operations:** (mapped to API endpoints)

**Transaction Operations:**
- ACH Push: `POST /transaction/ach/push` (requires: accountNumber, amount, counterpartyId, secCode)
- ACH Pull: `POST /transaction/ach/pull` (requires: accountNumber, amount, counterpartyId, secCode)
- Wire Domestic: `POST /transaction/wire/outbound` (requires: accountNumber, counterpartyId, amount)
- Wire International: `POST /transaction/wire/international` (requires: accountNumber, counterpartyId, creditAmount OR debitAmount, currencies)
- Internal Transfer: `POST /transaction/internal/transfer` (requires: fromAccountNumber, toAccountNumber, amount)
- Transaction Search: `POST /transaction/search` (filter by status, dates, accountNumber)

**ACH Processing:**
- Load Outbound File: `POST /ach/load/outbound` (multipart file upload)
- File Status: `GET /ach/file/status/v2` (track processing)
- Simulate Inbound: `POST /simulation/ach/inbound` (test ACH receipts)
- Simulate NOC: `POST /simulation/ach/noc` (Notification of Change)
- Simulate Return: `POST /simulation/ach/outbound/return` (ACH returns)

**Customer Management:**
- Create Individual: `POST /individual` (requires: firstName, lastName, address, idNumber, productId)
- Update Individual: `PUT /individual/{id}` (update customer data)
- Create Business: `POST /business` (requires: legalName, ein, address, productId)
- Update Business: `PUT /business/{id}` (update business data)
- Search: `POST /individual/search`, `POST /business/search`

**Account Management:**
- Get Account: `GET /account/{accountNumber}` (view details)
- Get Balance: `GET /account/{accountNumber}/balance` (current balance)
- Update Status: `PUT /account/{accountNumber}/status` (ACTIVE, BLOCKED, INACTIVE, CLOSED)
- List by Customer: `GET /account/individual/{id}`, `GET /account/business/{id}`

**Compliance:**
- Search Alerts: `POST /alerts/search` (filter by status, type, dates)
- Get Alert: `GET /alerts/{alertId}` (alert details)
- Update Alert: `PUT /alerts/{alertId}` (resolve, escalate)
- Add Note: `POST /alerts/{alertId}/add-note` (compliance notes)
- RFI Operations: `POST /alerts/rfi/{alertId}` (Request for Information)

**Counterparty Operations:**
- Create: `POST /counterparty` (for ACH/Wire transactions)
- Search: `POST /counterparty/search`
- Get Details: `GET /counterparty/{id}`
- Update: `PUT /v2/counterparty/{id}`

**Statements:**
- Product Statements: `GET /statement/product/{productId}`
- Account Statements: `GET /v2/statement/account/{accountNumber}`

**How It Works:**
1. Playwright launches real Chromium browser
2. Browser loads dashboard from localhost:3000
3. Dashboard makes real HTTP calls to `api.test.braid.zone`
4. Tests interact with UI (click, type, submit)
5. Verify state changes via UI and API responses

**Test Data:**
- References stable test accounts from `test-grouping-manifest.json`
- Reset balances before each run via API
- No dynamic account creation (unless testing creation flow itself)

**Configuration:**
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000',
    // Dashboard will hit real Braid test API
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
  },
})
```

**Target:** 100% of critical dashboard paths

---

## Test Case Strategy: The Rule of Three

Every testable unit requires **exactly 3 test cases**:

### 1. Happy Path
Expected behavior under normal conditions

```typescript
test('creates transaction successfully', async () => {
  // Valid inputs → Expected success
})
```

### 2. Edge Cases
Boundary values, unusual but valid inputs

```typescript
test('handles zero amount and maximum limits', () => {
  // Boundaries: 0, max values, special chars, timezones
})
```

### 3. Ugly Cases
Error conditions, invalid inputs, system failures

```typescript
test('handles API timeout gracefully', async () => {
  // null, undefined, API errors, network failures
})
```

**Why this matters:**
- Predictable coverage for every feature
- Easy to review and maintain
- AI validates adherence automatically
- Clear signal when failures occur

---

## Test Results & Reporting

### What Happens After Each Test Run

1. **Test Execution** → Structured JSON results generated
2. **AI Analysis** → Parses results, classifies failures, identifies patterns
3. **Jira Ticket Creation** → Auto-creates tickets for Critical/High failures
4. **Daily Digest** → Consolidates all results into morning report

### Jira Ticket Contents

Each auto-generated ticket includes:
- Test name and failure description
- Full error message and stack trace
- Screenshots/videos (for E2E failures)
- Code location reference
- Reproduction steps
- Root cause hypothesis from AI
- Suggested investigation approach
- Assigned to component owner
- Labels: `automated-test`, `test-failure`, severity

### Daily Digest Email

Sent to engineering team at 4 AM UTC (before work day):
- Overall test health score (0-100)
- Pass/fail counts per workflow
- Coverage trends
- Critical issues requiring attention
- All new Jira tickets created
- Top 5 actionable recommendations

---

## Technology Stack

### Testing Tools
- **Vitest**: Fast unit/UI test runner with ESM support
- **React Testing Library**: Component testing with user-centric approach
- **Playwright**: Modern E2E testing with trace files and screenshots
- **MSW (Mock Service Worker)**: API mocking for unit/UI tests

### Supporting Tools
- **Faker.js**: Generate realistic test data
- **tsx**: Execute TypeScript scripts for data seeding/cleanup
- **OpenAI API**: Power AI test analysis
- **Jira API**: Auto-create tickets
- **SMTP**: Email digest delivery

---

## Required Setup

### GitHub Secrets (Already Configured by DevOps)
```
BRAID_TEST_API_URL
BRAID_TEST_API_TOKEN
TEST_USER_POOLS_ID
TEST_USER_POOLS_CLIENT_ID
TEST_USER_EMAIL
TEST_USER_PASSWORD
OPENAI_API_KEY
JIRA_API_TOKEN
JIRA_PROJECT_KEY
SMTP_SERVER / SMTP_USERNAME / SMTP_PASSWORD
ENGINEERING_TEAM_EMAIL
SLACK_WEBHOOK_URL
```

### Package Scripts (Added to Development)
```bash
# Run tests locally
npm run test:ui             # Run UI tests with MSW
npm run test:e2e            # Run E2E tests (requires url.json → test API)

# Test data management
npm run test:setup-grouping # One-time: Create test program/products in Braid
npm run test:reset          # Reset test account balances before run
npm run test:verify         # Verify test grouping health
```

**Note:** E2E tests require `url.json` configured to point to Braid test API:
```json
{
  "url": "https://api.test.braid.zone"
}
```

---

## Directory Structure

```
core_web_dashboard/
├── .github/
│   └── workflows/
│       ├── ui-tests-daily.yml
│       ├── integration-tests-daily.yml
│       ├── ai-test-analysis.yml
│       └── daily-digest.yml
├── src/
│   ├── __mocks__/              # Mock AWS Amplify, Next.js, API client
│   ├── test-utils/             # Shared test helpers
│   └── [source code]
├── e2e/
│   ├── critical-paths/         # E2E test specs
│   └── fixtures/               # Auth, cleanup helpers
├── scripts/
│   ├── setup-test-grouping.ts  # One-time: Create test program/products
│   ├── reset-test-data.ts      # Reset account balances before tests
│   ├── ai-analyze-tests.js     # AI analysis entry point
│   └── generate-daily-digest.js
├── test-grouping-manifest.json # Stable test entity IDs (not in git)
├── url.json                    # API base URL (not in git)
├── reports/                    # Generated test reports
├── vitest.ui.config.ts         # UI test config
└── playwright.config.ts        # E2E test config
```

---

## What to Expect

### Morning Routine
1. Check email for Daily Digest
2. Review overall health score
3. Check new Jira tickets (if any failures)
4. Prioritize critical issues

### When Tests Fail
1. **Jira ticket auto-created** with full context
2. **AI provides hypothesis** of root cause
3. **Developer investigates** using provided info
4. **Fix code** and verify locally
5. **Next day's run** validates fix

### When Tests Pass
1. Green status in digest
2. Coverage trends tracked
3. Confidence in production deployments

---

## Benefits

✅ **Zero Developer Friction** - Runs independently, no blocking  
✅ **Early Detection** - Find issues before production  
✅ **Historical Trends** - Track test health over time  
✅ **Automated Triage** - AI classifies and assigns tickets  
✅ **Comprehensive Coverage** - UI → E2E layered testing  
✅ **Morning Readiness** - Results waiting when work day starts

---

## Failure Philosophy

- Tests failures **DO NOT block** deployments
- Tests provide **early warning signals**
- Critical failures get **immediate attention via Jira**
- Flaky tests are **tracked separately** (not ticketed immediately)
- Historical data helps identify **patterns and regressions**

---

## Questions?

- **Who owns this system?** QA team maintains infrastructure, dev team writes tests
- **How do I run tests locally?** See package scripts above
- **How do I add new tests?** Follow Rule of Three pattern (Happy/Edge/Ugly)
- **What if test environment is down?** E2E workflow has timeout, notifies Slack
- **Can I disable specific tests?** Yes, mark with `.skip()` temporarily and document why

---

## Getting Started

### For Developers Writing Tests
1. Review existing tests for patterns
2. Follow Rule of Three (Happy/Edge/Ugly)
3. Use test utilities in `src/test-utils/`
4. Run locally before pushing: `npm run test:ui && npm run test:e2e`

### For Team Leads
1. Subscribe to daily digest email
2. Monitor Jira board for auto-created tickets
3. Review weekly test health trends
4. Adjust priorities based on critical failures

### For QA Team
1. Maintain test infrastructure and workflows
2. Monitor GitHub Actions execution
3. Update MSW handlers when API changes
4. Expand E2E coverage for new features

---

**This system is designed to work for you, not against you. Tests run while you sleep, results ready when you wake up.**
