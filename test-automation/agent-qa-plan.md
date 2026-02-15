# Agent QA Plan - Automated Testing System

## Overview

Automated testing system with two independent workflows running daily during off-hours. AI agents analyze results, generate reports, and create Jira tickets for failures. **All analysis is read-only - agents never modify code.**

**Testing Focus:** Developer role workflows using a simplified single-product tenant setup.

**Note:** Unit testing is handled by developers as part of their development workflow and is excluded from this automated QA system.

### Developer Tenant Approach

Tests are organized around **typical developer testing scenarios**:
- Single Product: `DEV_CHECKING` (simplifies testing, matches real dev workflow)
- 5 Test Accounts: Various balance states (funded, zero, high, inactive, business)
- 4 Test Customers: Individual and business test entities 
- 4 Counterparties: ACH/Wire testing (domestic, international, blocked)

### Workflow Coverage

1. **Customer & Counterparty Management** - Create and manage test entities
2. **Transaction Testing & Simulation** - ACH, Wire, Internal transfers
3. **Account Viewing & Management** - Monitor accounts and balances
4. **Compliance Monitoring** - Review alerts and OFAC results
5. **ACH File Processing** - Upload and process test files
6. **Webhook & Event Testing** - Verify event generation

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

**Approach: Developer Tenant - Simplified Single Product Setup**

Focused on **Developer role workflows** with minimal but sufficient test entities:

```
Developer Test Tenant (development.braid.zone)
│
├─→ Product: ID 1069832 (Existing - DO NOT CREATE)
│   └─→ Type: CHECKING (pre-configured product)
│
├─→ Test Customers (created dynamically using Faker.js)
│   Individuals:
│   ├─→ Generated via generateIndividual() - productId: 1069832
│   ├─→ Realistic names, SSN, addresses, DOB
│   └─→ Email: faker-generated @devtest.braid.zone
│   Business:
│   └─→ Generated via generateBusiness() - productId: 1069832
│       └─→ Company names, EINs, business addresses
│
├─→ Test Accounts (automatically created with customers)
│   ├─→ Accounts created when customers onboarded
│   ├─→ All belong to productId: 1069832
│   └─→ Various balance states for testing scenarios
│
└─→ Test Counterparties (generated with real routing numbers)
    ├─→ ACH: Generated via generateACHCounterparty()
    │   └─→ Real routing: 121000248, 026009593, 021000021, etc.
    ├─→ Wire Domestic: Generated via generateDomesticWireCounterparty()
    │   └─→ Real routing + SWIFT codes
    └─→ Wire International: Generated via generateInternationalWireCounterparty()
        └─→ SWIFT codes: CHASUS33, BOFAUS3N, WFBIUS6S, etc.
```

**Key Configuration:**
- **Product ID:** `1069832` (use for ALL customer/account creation)
- **Environment:** `https://development.braid.zone`
- **API Authentication:** API Key in request headers
- **Data Generation:** Faker.js for all dynamic entities
- **Routing Numbers:** Real bank routing numbers for validation

---

### Dynamic Test Data Generation with Faker.js

**Purpose:** Generate realistic customer and counterparty data during test execution

**Faker.js Usage:**
```typescript
import { faker } from '@faker-js/faker';

// Generate realistic individual customer
const generateIndividual = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email({ provider: 'devtest.braid.zone' }),
  phoneNumber: faker.phone.number('###-###-####'),
  dateOfBirth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
  ssn: faker.string.numeric(9), // Format: 123456789
  address: {
    line1: faker.location.streetAddress(),
    line2: faker.location.secondaryAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode('#####')
  }
});

// Generate realistic business customer
const generateBusiness = () => ({
  legalName: faker.company.name() + ' LLC',
  dba: faker.company.name(),
  ein: `${faker.string.numeric(2)}-${faker.string.numeric(7)}`, // Format: 12-3456789
  email: faker.internet.email({ provider: 'devtest.braid.zone' }),
  phoneNumber: faker.phone.number('###-###-####'),
  incorporationDate: faker.date.past({ years: 10 }),
  businessType: faker.helpers.arrayElement(['LLC', 'CORPORATION', 'PARTNERSHIP']),
  address: {
    line1: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode('#####')
  }
});
```

---

### Real Routing Numbers & Bank Details

**ACH Counterparty Creation - Use Real Bank Routing Numbers:**

```typescript
// Real ACH Routing Numbers for Testing
const REAL_ACH_ROUTING_NUMBERS = [
  { routing: '121000248', bank: 'Wells Fargo Bank', type: 'ACH' },
  { routing: '026009593', bank: 'Bank of America', type: 'ACH' },
  { routing: '011401533', bank: 'Chase Bank', type: 'ACH' },
  { routing: '021000021', bank: 'JPMorgan Chase', type: 'ACH' },
  { routing: '111000025', bank: 'Bank of Hawaii', type: 'ACH' },
  { routing: '122105155', bank: 'Wells Fargo Bank (West)', type: 'ACH' },
  { routing: '063100277', bank: 'Fifth Third Bank', type: 'ACH' },
  { routing: '091000019', bank: 'Wells Fargo Bank (East)', type: 'ACH' },
  { routing: '041215663', bank: 'Wells Fargo Bank (South)', type: 'ACH' },
  { routing: '031100209', bank: 'KeyBank', type: 'ACH' }
];

// Generate ACH counterparty with real routing number
const generateACHCounterparty = () => {
  const bank = faker.helpers.arrayElement(REAL_ACH_ROUTING_NUMBERS);
  return {
    name: faker.company.name() + ' Payments',
    accountType: faker.helpers.arrayElement(['CHECKING', 'SAVINGS']),
    accountNumber: faker.string.numeric(10), // 10-digit account number
    routingNumber: bank.routing,
    bankName: bank.bank,
    type: 'BUSINESS',
    address: {
      line1: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode('#####')
    }
  };
};
```

**Wire Counterparty Creation - Domestic & International:**

```typescript
// Real Wire Routing Numbers (Fedwire)
const REAL_WIRE_ROUTING_NUMBERS = [
  { routing: '026009593', bank: 'Bank of America', swift: 'BOFAUS3N' },
  { routing: '021000021', bank: 'JPMorgan Chase', swift: 'CHASUS33' },
  { routing: '121000248', bank: 'Wells Fargo', swift: 'WFBIUS6S' },
  { routing: '011001234', bank: 'Citibank', swift: 'CITIUS33' },
  { routing: '026007993', bank: 'Bank of America (Wire)', swift: 'BOFAUS6S' }
];

// Generate domestic wire counterparty
const generateDomesticWireCounterparty = () => {
  const bank = faker.helpers.arrayElement(REAL_WIRE_ROUTING_NUMBERS);
  return {
    name: faker.company.name() + ' Wire Recipient',
    accountNumber: faker.string.numeric(12),
    routingNumber: bank.routing,
    bankName: bank.bank,
    type: 'BUSINESS',
    address: {
      line1: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode('#####')
    }
  };
};

// Generate international wire counterparty
const generateInternationalWireCounterparty = () => {
  const bank = faker.helpers.arrayElement(REAL_WIRE_ROUTING_NUMBERS);
  return {
    name: faker.company.name() + ' International',
    swiftCode: bank.swift,
    iban: generateIBAN('US'), // US IBAN format
    bankName: bank.bank,
    bankAddress: {
      line1: faker.location.streetAddress(),
      city: faker.location.city(),
      country: 'US'
    },
    beneficiaryAddress: {
      line1: faker.location.streetAddress(),
      city: faker.location.city(),
      country: faker.location.countryCode('alpha-2')
    },
    type: 'BUSINESS'
  };
};

// Generate valid US IBAN for testing
const generateIBAN = (countryCode: string) => {
  const bankCode = faker.string.numeric(4);
  const accountNumber = faker.string.numeric(16).padStart(16, '0');
  // Simplified IBAN generation (US format)
  return `${countryCode}${faker.string.numeric(2)}${bankCode}${accountNumber}`;
};
```

**Common International SWIFT Codes:**

```typescript
const INTERNATIONAL_BANKS = [
  { swift: 'CHASUS33', bank: 'JPMorgan Chase (US)', country: 'US' },
  { swift: 'CITIUS33', bank: 'Citibank (US)', country: 'US' },
  { swift: 'BOFAUS3N', bank: 'Bank of America (US)', country: 'US' },
  { swift: 'WFBIUS6S', bank: 'Wells Fargo (US)', country: 'US' },
  { swift: 'DEUTDEFF', bank: 'Deutsche Bank (Germany)', country: 'DE' },
  { swift: 'HSBCGB2L', bank: 'HSBC (UK)', country: 'GB' },
  { swift: 'BNPAFRPP', bank: 'BNP Paribas (France)', country: 'FR' },
  { swift: 'CHASAU2X', bank: 'JPMorgan Chase (Australia)', country: 'AU' },
  { swift: 'RBOSCATT', bank: 'Royal Bank of Scotland (Canada)', country: 'CA' }
];
```

---

**Test Configuration File:** `test-config.json` (Developer Tenant settings)
```json
{
  "environment": "development",
  "baseUrl": "https://development.braid.zone",
  "apiKey": "MM2rWoKgkLfDEJoOTWV57q9QAcXOxbV2kqQoQ088",
  "username": "qagentuser1",
  "product": {
    "id": 1069832,
    "type": "CHECKING",
    "description": "Existing product - DO NOT CREATE"
  },
  "testDataGeneration": {
    "useRealRoutingNumbers": true,
    "useRealSwiftCodes": true,
    "emailDomain": "devtest.braid.zone"
  }
}
```

**Test Execution Pattern:**
```typescript
import testConfig from './test-config.json';
import { generateIndividual, generateACHCounterparty } from './test-data/generators';

// All test entities use the configured product ID
const PRODUCT_ID = testConfig.product.id; // 1069832

test('Create individual customer for testing', async () => {
  const customer = generateIndividual();
  customer.productId = PRODUCT_ID; // Always use 1069832
  
  const response = await apiClient.post('/individual', customer, {
    headers: { 'X-API-Key': testConfig.apiKey }
  });
  
  expect(response.status).toBe(201);
  // Store customer ID for cleanup
  testCleanup.addCustomer(response.data.id);
});

test('Create ACH counterparty with real routing', async () => {
  const counterparty = generateACHCounterparty(); // Real Wells Fargo routing
  
  const response = await apiClient.post('/counterparty', counterparty, {
    headers: { 'X-API-Key': testConfig.apiKey }
  });
  
  expect(response.status).toBe(201);
  expect(response.data.routingNumber).toBe('121000248'); // Real routing validated
  testCleanup.addCounterparty(response.data.id);
});
```

**Dynamic Test Manifest** - Generated during test execution:
```json
{
  "environment": "development",
  "productId": 1069832,
  "createdAt": "2026-02-14T02:00:00Z",
  "testRun": {
    "customers": [
      {
        "id": 123456,
        "type": "INDIVIDUAL",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe.xyz123@devtest.braid.zone",
        "productId": 1069832
      }
    ],
    "counterparties": [
      {
        "id": 234567,
        "name": "Test Vendor Payments",
        "routingNumber": "121000248",
        "accountNumber": "9876543210",
        "type": "BUSINESS"
      }
    ],
    "accounts": [
      {
        "id": 345678,
        "accountNumber": "ACC1234567890",
        "customerId": 123456,
        "productId": 1069832,
        "balance": 10000.00
      }
    ]
  }
}
```

**API Compliance Notes:**
- All IDs match API integer format (not strings)
- Account types: `CHECKING` or `SAVINGS` (per OpenAPI enum)
- Account statuses: `ACTIVE`, `BLOCKED`, `INACTIVE`, `CLOSED` (per OpenAPI enum)
- Customer types: `INDIVIDUAL` or `BUSINESS`
- Counterparty fields match API requirements for ACH/Wire transactions
- **Product ID:** Always use `1069832` for all test entities

**Tests reference generated entities:**
```typescript
import testConfig from '../test-config.json'
import { generateIndividual, generateACHCounterparty } from '../test-data/generators';

test('Developer creates ACH push transaction', async ({ page }) => {
  // Generate customer and counterparty for test
  const customer = generateIndividual();
  customer.productId = testConfig.product.id; // 1069832
  
  const counterparty = generateACHCounterparty(); // Real routing number
  
  // Create entities via API
  const customerRes = await createCustomer(customer);
  const counterpartyRes = await createCounterparty(counterparty);
  
  // Get generated account number from customer creation
  const account = await getCustomerAccount(customerRes.id);
  
  // Dashboard makes POST /transaction/ach/push
  await page.goto('/transactions/newTransaction');
  await page.fill('[name="accountNumber"]', account.accountNumber);
  await page.fill('[name="amount"]', '100.00');
  await page.selectOption('[name="counterpartyId"]', counterpartyRes.id.toString());
  
  // Cleanup after test
  await cleanup.deleteCustomer(customerRes.id);
  await cleanup.deleteCounterparty(counterpartyRes.id);
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
**What it tests:** Complete Developer role workflows against real Braid test API  
**Technology:** Playwright with Chromium  
**API Strategy:** Real HTTP calls to Braid test environment  
**Speed:** Slower (~25-30 minutes)  
**Focus:** Developer testing scenarios using simplified single-product tenant

---

**Developer Workflow Coverage:** (organized by typical developer tasks)

#### 1. Customer & Counterparty Management
**Scenario:** Developer creates test customers and counterparties for transaction testing

**Individual Customer:**
- Create: `POST /individual` (firstName, lastName, address, idNumber, productId)
- View: `GET /individual/{id}`
- Update: `PUT /individual/{id}` (update profile data)
- Search: `POST /individual/search` (find by name, email, customer ID)

**Business Customer:**
- Create: `POST /business` (legalName, ein, address, productId)
- View: `GET /business/{id}`
- Update: `PUT /business/{id}` (update business data)
- Search: `POST /business/search` (find by name, EIN)

**Counterparty Management:**
- Create: `POST /counterparty` (for ACH/Wire transactions)
- View: `GET /counterparty/{id}`
- Update: `PUT /v2/counterparty/{id}` (modify routing, account info)
- Search: `POST /counterparty/search` (find by name, routing number)

**Using Faker.js for Realistic Data:**

```typescript
import { faker } from '@faker-js/faker';
import { REAL_ACH_ROUTING_NUMBERS, REAL_WIRE_ROUTING_NUMBERS } from './test-data';

test('Create individual customer with realistic data', async ({ page }) => {
  const customer = generateIndividual(); // Uses faker.js
  
  await page.goto('/individuals/create');
  await page.fill('[name="firstName"]', customer.firstName);
  await page.fill('[name="lastName"]', customer.lastName);
  await page.fill('[name="email"]', customer.email);
  await page.fill('[name="ssn"]', customer.ssn);
  await page.fill('[name="address.line1"]', customer.address.line1);
  await page.fill('[name="address.city"]', customer.address.city);
  await page.selectOption('[name="productId"]', '1069832'); // Existing product
  
  await page.click('button[type="submit"]');
  await expect(page.locator('.success-message')).toBeVisible();
});

test('Create ACH counterparty with real routing number', async ({ page }) => {
  const counterparty = generateACHCounterparty(); // Uses real routing number
  
  await page.goto('/businesses/counterparty/create');
  await page.fill('[name="name"]', counterparty.name);
  await page.fill('[name="routingNumber"]', counterparty.routingNumber); // Real Wells Fargo routing
  await page.fill('[name="accountNumber"]', counterparty.accountNumber);
  await page.selectOption('[name="accountType"]', counterparty.accountType);
  
  await page.click('button[type="submit"]');
  await expect(page.locator('.success-message')).toContainText('Counterparty created');
  
  // Verify routing number validation passed
  await expect(page.locator('.error-message')).not.toBeVisible();
});

test('Create international wire counterparty with SWIFT code', async ({ page }) => {
  const counterparty = generateInternationalWireCounterparty();
  
  await page.goto('/businesses/counterparty/create');
  await page.fill('[name="name"]', counterparty.name);
  await page.fill('[name="swiftCode"]', counterparty.swiftCode); // Real SWIFT code
  await page.fill('[name="iban"]', counterparty.iban);
  await page.fill('[name="bankName"]', counterparty.bankName);
  
  await page.click('button[type="submit"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

**Test Cases:**
- ✅ Create individual customer with DEV_CHECKING product (using faker.js)
- ✅ Create business customer with valid EIN (faker-generated)
- ✅ Create ACH counterparty with real Wells Fargo routing number (121000248)
- ✅ Create wire counterparty with real Bank of America routing (026009593)
- ✅ Create international wire counterparty with SWIFT code (CHASUS33)
- ⚠️ Attempt to create customer with invalid SSN format (validation)
- ⚠️ Create counterparty with invalid routing number (should fail validation)
- ❌ Create counterparty with blocked status (error handling)

---

#### 2. Transaction Testing & Simulation
**Scenario:** Developer tests transaction flows using Developer tenant accounts

**ACH Transactions:**
- Push (Debit): `POST /transaction/ach/push` (send money from account to counterparty)
- Pull (Credit): `POST /transaction/ach/pull` (pull money from counterparty to account)
- Simulate Inbound: `POST /simulation/ach/inbound` (simulate receiving ACH)
- Simulate NOC: `POST /simulation/ach/noc` (Notification of Change)
- Simulate Return: `POST /simulation/ach/outbound/return` (simulate ACH rejection)

**Wire Transactions:**
- Domestic Wire: `POST /transaction/wire/outbound` (domestic wire transfer)
- International Wire: `POST /transaction/wire/international` (cross-border transfer)
- Simulate Inbound: `POST /simulation/wire/inbound` (simulate receiving wire)

**Internal Transfers:**
- Transfer: `POST /transaction/internal/transfer` (between DEV tenant accounts)

**Transaction Monitoring:**
- Search: `POST /transaction/search` (filter by status, dates, account)
- View Details: `GET /transaction/{transactionId}`
- Transaction History: View account transaction list

**Test Cases:**
- ✅ ACH push from DEV_CHK_FUNDED to DEV_ACH_VENDOR ($100)
- ✅ ACH pull from counterparty to DEV_CHK_FUNDED ($50)
- ✅ Wire domestic from DEV_CHK_HIGHBAL to DEV_WIRE_DOMESTIC ($5,000)
- ✅ Internal transfer from DEV_CHK_HIGHBAL to DEV_CHK_ZERO ($500)
- ⚠️ ACH push from DEV_CHK_ZERO (insufficient funds)
- ⚠️ Transaction to DEV_ACH_BLOCKED counterparty (blocked error)
- ❌ Wire with invalid routing number

---

#### 3. Account Viewing & Management
**Scenario:** Developer monitors account state and balances

**Account Operations:**
- View Account: `GET /account/{accountNumber}` (account details)
- Get Balance: `GET /account/{accountNumber}/balance` (current balance)
- List by Customer: `GET /account/individual/{id}` or `GET /account/business/{id}`
- Update Status: `PUT /account/{accountNumber}/status` (ACTIVE, INACTIVE, BLOCKED, CLOSED)
- Account Statements: `GET /v2/statement/account/{accountNumber}`

**Test Cases:**
- ✅ View DEV_CHK_FUNDED account details
- ✅ Check balance after transaction
- ✅ List all accounts for dev_active customer
- ✅ View account statement for last 30 days
- ⚠️ Update account status to INACTIVE
- ⚠️ Attempt transaction on INACTIVE account (should fail)

---

#### 4. Compliance Monitoring
**Scenario:** Developer reviews alerts generated during testing

**Alert Operations:**
- Search: `POST /alerts/search` (filter by status, type, customer, dates)
- View Alert: `GET /alerts/{alertId}` (alert details)
- Add Note: `POST /alerts/{alertId}/add-note` (add compliance notes)
- Update Status: `PUT /alerts/{alertId}` (resolve, escalate, investigate)
- RFI Operations: `POST /alerts/rfi/{alertId}` (Request for Information)

**OFAC Checks:**
- Triggered automatically during customer/counterparty creation
- View results in compliance tab

**Test Cases:**
- ✅ View alerts for DEV tenant
- ✅ Filter alerts by type (OFAC, AML, suspicious activity)
- ✅ Add note to alert
- ✅ Resolve alert with disposition
- ⚠️ Search for alerts by customer ID

---

#### 5. ACH File Processing (Developer Testing)
**Scenario:** Developer uploads ACH files for processing simulation

**ACH File Operations:**
- Upload Outbound File: `POST /ach/load/outbound` (multipart file upload)
- Check File Status: `GET /ach/file/status/v2` (processing status)
- View ACH Settlement: Dashboard view of processed transactions

**Test Cases:**
- ✅ Upload valid NACHA file
- ✅ Poll file status until complete
- ⚠️ Upload invalid NACHA file (format error)
- ❌ Upload file with blocked counterparty (rejection)

---

#### 6. Webhook & Event Testing
**Scenario:** Developer verifies event notifications for integrations

**Event Monitoring:**
- View transaction events
- View account status change events
- View compliance alert events

**Test Cases:**
- ✅ Create transaction → Verify event generated
- ✅ Update account status → Verify event in logs
- ✅ Create customer → Verify creation event

---

**How It Works:**
1. Playwright launches real Chromium browser
2. Browser loads dashboard from localhost:3000
3. Developer user logs in (DEV role)
4. Dashboard makes real HTTP calls to `api.test.braid.zone`
5. Tests interact with UI using Developer tenant entities (click, type, submit)
6. Verify state changes via UI and API responses

**Test Data:**
- Dynamic entity generation using Faker.js and real routing numbers
- All tests use Product ID: **1069832** (existing product)
- Reset account balances before each run via API
- **Uses Faker.js to generate realistic customer/counterparty data** during test execution
- **Uses real routing numbers** for ACH transactions (Wells Fargo, Bank of America, Chase, etc.)
- **Uses real SWIFT codes** for wire transfers (CHASUS33, BOFAUS3N, WFBIUS6S, etc.)
- Creates/deletes test entities during test execution (customers, counterparties, transactions)
- Cleanup after each test to maintain tenant hygiene

**Configuration:**
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000',
    // Dashboard hits real Braid test API (api.test.braid.zone)
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
  },
})
```

**Test Execution Example:**
```typescript
import manifest from '../test-grouping-manifest.json'

test('Developer creates ACH push transaction', async ({ page }) => {
  const account = manifest.accounts.funded  // DEV_CHK_FUNDED
  const counterparty = manifest.counterparties.ach_vendor  // DEV_ACH_VENDOR
  
  // Navigate to transaction page
  await page.goto('/transactions/newTransaction')
  
  // Fill transaction form
  await page.selectOption('[name="transactionType"]', 'ACH_PUSH')
  await page.fill('[name="accountNumber"]', account.accountNumber)
  await page.fill('[name="amount"]', '100.00')
  await page.selectOption('[name="counterpartyId"]', counterparty.id.toString())
  
  // Submit and verify
  await page.click('button[type="submit"]')
  await expect(page.locator('.success-message')).toBeVisible()
  
  // Verify balance deducted
  const newBalance = await getAccountBalance(account.accountNumber)
  expect(newBalance).toBe(9900.00)  // $10,000 - $100
})
```

**Target:** 100% coverage of Developer role workflows

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

### Test Data Generation
- **@faker-js/faker**: Generate realistic customer, business, and counterparty data
  - Personal information (names, emails, addresses, phone numbers, SSN)
  - Business information (company names, EINs, incorporation dates)
  - Banking details (account numbers, realistic test data)
- **Real Routing Numbers**: ACH/Wire testing with actual bank routing numbers
  - Wells Fargo (121000248), Bank of America (026009593), Chase (021000021)
- **Real SWIFT Codes**: International wire testing with valid SWIFT codes
  - CHASUS33 (Chase), BOFAUS3N (BofA), WFBIUS6S (Wells Fargo)

### Supporting Tools
- **tsx**: Execute TypeScript scripts for data seeding/cleanup
- **OpenAI API**: Power AI test analysis
- **Jira API**: Auto-create tickets
- **SMTP**: Email digest delivery

---

## Required Setup

### Developer Tenant Configuration

**Environment:** Braid Development  
**Product ID:** `1069832` (Existing product - no need to create)  
**Test User:** `qagentuser1`  
**API Key:** `MM2rWoKgkLfDEJoOTWV57q9QAcXOxbV2kqQoQ088`  
**Base URL:** `https://development.braid.zone`

**Local Configuration File** (`url.json`):
```json
{
  "url": "https://development.braid.zone"
}
```

**Authentication Setup:**
- Username: `qagentuser1`
- API Key included in request headers: `X-API-Key: MM2rWoKgkLfDEJoOTWV57q9QAcXOxbV2kqQoQ088`
- Product ID: `1069832` (use this for all customer/account creation)

**Important Notes:**
- ⚠️ **Do NOT create new products** - Use existing Product ID `1069832`
- All test customers must be created with `productId: 1069832`
- All test accounts will belong to this product
- API authentication uses API key (not Cognito tokens for E2E tests)

---

### GitHub Secrets (Already Configured by DevOps)
```
BRAID_DEV_API_URL=https://development.braid.zone
BRAID_DEV_API_KEY=MM2rWoKgkLfDEJoOTWV57q9QAcXOxbV2kqQoQ088
BRAID_DEV_PRODUCT_ID=1069832
TEST_USER_EMAIL=qagentuser1@braid.zone
TEST_USER_PASSWORD=[stored in secrets]
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
npm run test:e2e            # Run E2E tests (requires test-config.json)

# Test data management (using Product ID 1069832)
npm run test:verify-config   # Verify test-config.json and API access
npm run test:cleanup         # Clean up test entities created during test runs
npm run test:generate-data   # Generate sample test data with Faker.js
```

**Note:** E2E tests require `test-config.json` configured with actual credentials:
```json
{
  "environment": "development",
  "baseUrl": "https://development.braid.zone",
  "apiKey": "MM2rWoKgkLfDEJoOTWV57q9QAcXOxbV2kqQoQ088",
  "username": "qagentuser1",
  "product": {
    "id": 1069832,
    "type": "CHECKING"
  }
}
```

**Setup Process:**
1. Create `test-config.json` with credentials (see above)
2. **DO NOT create new products** - Use existing Product ID 1069832
3. Tests dynamically create/delete customers and counterparties using Faker.js
4. Cleanup script removes test entities after each run
5. Product 1069832 remains stable, only test data is ephemeral

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
│   ├── fixtures/               # Auth, cleanup helpers
│   └── test-data/              # Test data generators
│       ├── generators.ts       # Faker.js data generation functions
│       ├── routing-numbers.ts  # Real ACH/Wire routing numbers
│       ├── swift-codes.ts      # Real SWIFT codes for international wires
│       └── test-entities.ts    # Helper functions for creating test entities
├── scripts/
│   ├── verify-config.ts        # Verify test-config.json and API access
│   ├── cleanup-test-data.ts    # Clean up test entities after run
│   ├── generate-sample-data.ts # Generate sample Faker.js data
│   ├── ai-analyze-tests.js     # AI analysis entry point
│   └── generate-daily-digest.js
├── test-config.json            # Test credentials & configuration (not in git)
├── test-run-manifest.json      # Generated during test run (not in git)
├── reports/                    # Generated test reports
├── vitest.ui.config.ts         # UI test config
└── playwright.config.ts        # E2E test config
```

**Test Configuration Files:**

```typescript
// test-config.json (create manually, not in git)
{
  "environment": "development",
  "baseUrl": "https://development.braid.zone",
  "apiKey": "MM2rWoKgkLfDEJoOTWV57q9QAcXOxbV2kqQoQ088",
  "username": "qagentuser1",
  "product": { "id": 1069832, "type": "CHECKING" }
}

// test-run-manifest.json (auto-generated during test execution)
{
  "testRunId": "2026-02-14-02-00-00",
  "productId": 1069832,
  "entitiesCreated": {
    "customers": ["customer_id_1", "customer_id_2"],
    "counterparties": ["cp_id_1", "cp_id_2"],
    "transactions": ["txn_id_1", "txn_id_2"]
  },
  "cleanup": "auto"
}
```

**Test Data Files Organization:**

```typescript
// e2e/test-data/generators.ts
export { generateIndividual, generateBusiness };
export { generateACHCounterparty, generateDomesticWireCounterparty };
export { generateInternationalWireCounterparty };

// e2e/test-data/routing-numbers.ts
export { REAL_ACH_ROUTING_NUMBERS, REAL_WIRE_ROUTING_NUMBERS };

// e2e/test-data/swift-codes.ts
export { INTERNATIONAL_BANKS, US_BANKS_WITH_SWIFT };

// e2e/test-data/test-entities.ts
export { createTestCustomer, createTestCounterparty, cleanupTestEntity };
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
