# Role-Based Access Control - Dashboard UI Pages

**Source:** Actual codebase analysis of RequireRole HOC and route restrictions  
**Purpose:** Identify which dashboard pages/workflows are accessible to developers vs admin-only

**Testing Context:** Dashboard UI automation tests need to know which pages to test with developer credentials

---

## Dashboard Pages - Developer Accessible ✅

### Customer Management
- ✅ `/individuals` - Individuals table
- ✅ `/individuals/[id]` - Individual detail page
- ✅ `/businesses` - Businesses table
- ✅ `/businesses/[id]` - Business detail page
- ✅ Create counterparties from customer detail pages

### Account Management
- ✅ `/accounts` - Accounts table with search
- ✅ `/accounts/[id]` - Account detail page
- ✅ `/accounts/[id]/accountTrans` - Account transactions tab
- ✅ `/accounts/[id]/counterparties` - Account counterparties tab
- ✅ `/accounts/[id]/limits` - Velocity limits tab
- ✅ `/accounts/[id]/fees` - Fees tab

### Transaction Management
- ✅ `/transactions/newTransaction` - New transaction form (Transfer, Adjustment, Wire)
- ✅ `/transactions/transactionHistory` - Transaction history table with filters
- ✅ `/transactions/transactionHistory/[id]` - Transaction detail page
- ✅ `/transactions/transactionReview` - Manual review queue

### ACH Processing (Partial Access)
- ✅ `/ach/processing` - ACH file upload form (OUTBOUND ONLY for developers)
- ✅ `/ach/processing/achTransStatus` - ACH transaction status table
- ✅ `/ach/noc` - NOC (Notification of Change) table
- ⚠️ Note: Developers can only upload "Originating" (outbound) files, not "Receiving" (inbound)

### Wire Processing
- ✅ `/wire/processing` - Wire file upload (inbound wires)
- ✅ `/wire/processing/wireTransStatus` - Wire transaction status
- ✅ `/wire/processing/wireFileErrors` - Wire file errors

### Compliance
- ✅ `/compliance/ofac` - OFAC alerts table (DEVELOPER_ROUTE)
- ✅ `/compliance/ofac/[id]` - OFAC alert detail page
- ✅ `/compliance/314a` - 314(a) checks table (DEVELOPER_ROUTE)
- ✅ `/compliance/314a/[id]` - 314(a) check detail
- ✅ `/compliance/limits` - Velocity limits configuration

### Configuration
- ✅ `/configuration/developers` - Developer/tenant management (DEVELOPER_ROUTE)
- ✅ `/configuration/developers/[id]` - Tenant detail page
- ✅ `/settings/userManagement` - User management (mixed access)

---

## Dashboard Pages - Admin Only ❌

### ACH Settlement (ADMIN_ROUTE)
- ❌ `/ach/settlement` - ACH settlement history table
- ❌ `/ach/settlement/returnFiles` - ACH return files table
- ❌ Approve/send settlement files

### Wire Settlement (ADMIN_ROUTE)
- ❌ `/wire/settlement` - Wire settlement page
- ❌ Wire return file management

### Product/Program Configuration (ADMIN_ROUTE)
- ❌ `/configuration/programs` - Program management
- ❌ `/configuration/programs/create` - Create new program
- ❌ `/configuration/products/create` - Create new product
- ❌ `/configuration/products/[id]/cfg` - ACH configuration page

### Reconciliation (Likely ADMIN_ROUTE)
- ❌ `/recon/fileUpload` - Reconciliation file upload
- ❌ `/recon/exceptionReview` - Exception review

---

## Dashboard UI Test Impact

### Pages We CAN Test (Developer Access) ✅
**Total:** ~15 dashboard pages covering:
- Customer tables and details (2 pages)
- Account tables and details (6 pages with tabs)
- Transaction workflows (4 pages)
- ACH processing outbound (2 pages)
- Wire processing (3 pages)
- Compliance monitoring (5 pages)
- Configuration (2 pages)

### Pages We CANNOT Test (Admin-Only) ❌
**Total:** ~8 admin-only pages:
- ACH settlement workflows (2 pages)
- Wire settlement workflows (1 page)
- Product/program management (4 pages)
- Reconciliation (2 pages)

---

## UI Test Strategy Summary

**Adjusted Test Plan:** 87 dashboard UI tests (down from 235 API tests)

**Why fewer tests?**
1. One UI test can cover multiple API calls (e.g., form submission → API request → UI update)
2. Focus on user workflows, not individual API endpoints
3. Testing what developers actually interact with (UI pages)
4. Admin-only pages excluded

**Test Coverage:**
- ✅ All core user workflows
- ✅ Form submissions and validation
- ✅ Table viewing, search, filter, pagination
- ✅ Navigation and detail views
- ✅ Error handling and user feedback
- ❌ Admin-only configuration/settlement workflows

---

## Admin-Only Features (CANNOT be tested with Developer role)

### 1. ACH Settlement Operations ❌ ADMIN ONLY
**File**: `src/app/ach/settlement/page.tsx`  
**Role**: `ADMIN_ROUTE` (line 77)  
**Features**:
- View ACH settlement history
- Approve settlement files
- Send settlement files to SFTP
- Download ACH settlement files

**API Endpoints**:
- `GET /ach/settlement?productId=X&startDate=Y&endDate=Z`
- `POST /ach/settlement/file/{filename}/approve?productId=X`
- `POST /ach/settlement/file/{filename}/send`

### 2. ACH Return File Management ❌ ADMIN ONLY
**File**: `src/app/ach/settlement/returnFiles/page.tsx`  
**Role**: `ADMIN_ROUTE` (line 140)  
**Features**:
- View ACH return files
- Approve return files
- Download return files

**API Endpoints**:
- `GET /ach/returnFiles?startDate=X&endDate=Y`
- `POST /ach/returnFiles/{filename}/approve`

### 3. ACH Inbound File Upload ❌ ADMIN ONLY
**File**: `src/app/ach/processing/page.tsx`  
**Role Check**: Line 56 - `userType == ADMIN_ROLE || userType == ADMIN_OPS_ROLE`  
**Restriction**: Developer role can only see "Originating" option, not "Receiving"

**Developer Access**: ✅ Can upload **Outbound** ACH files only  
**Admin Access**: ✅ Can upload both **Inbound** and **Outbound** ACH files

**API Endpoints**:
- ❌ `POST /ach/load/inbound?filename=X` - ADMIN ONLY
- ✅ `POST /ach/load/outbound?filename=X` - DEVELOPER ACCESS

### 4. Wire Settlement Operations ❌ ADMIN ONLY
**File**: `src/app/wire/settlement/page.tsx`  
**Role**: `ADMIN_ROUTE` (line 443)  
**Features**:
- View wire settlement history
- Run settlement generation
- Approve settlement files
- Download settlement files

**API Endpoints**:
- `GET /wire/settlement?startDate=X&endDate=Y`
- `POST /wire/settlement/generate`
- `POST /wire/settlement/{filename}/approve`

### 5. Wire Return File Management ❌ ADMIN ONLY
**File**: `src/app/wire/settlement/returnFiles/page.tsx`  
**Role**: `ADMIN_ROUTE` (line 160)  
**Features**:
- View wire return files
- Run return settlement
- Approve return settlements

**API Endpoints**:
- `GET /wire/returnFiles?startDate=X&endDate=Y`
- `POST /wire/returnFiles/generate`
- `POST /wire/returnFiles/{filename}/approve`

### 6. Program Management ❌ ADMIN ONLY
**Files**: 
- `src/app/configuration/programs/page.tsx` (line 24)
- `src/app/configuration/programs/create/page.tsx` (line 150)
- `src/app/configuration/programs/[id]/page.tsx` (line 434)

**Role**: `ADMIN_ROUTE`  
**Features**:
- View programs list
- Create new programs
- Edit program details
- Update program configuration

**API Endpoints**:
- `POST /program`
- `PUT /program/{id}`
- `PATCH /program/{id}/baseUrl`

### 7. Product Creation ❌ ADMIN ONLY
**File**: `src/app/configuration/products/create/hidden_page.tsx`  
**Role**: `ADMIN_ROUTE` (line 375)  
**Features**:
- Create new products

**API Endpoint**:
- `POST /product`

### 8. Product ACH Configuration ❌ ADMIN ONLY
**File**: `src/app/configuration/products/[id]/cfg/page.tsx`  
**Role**: `ADMIN_ROUTE` (line 1529)  
**Features**:
- Update ACH configuration
- Set processing windows
- Configure ODFI
- Set holidays and calendars
- Update funds availability settings

**API Endpoints**:
- `PUT /product/{id}/achConfig`
- `PUT /product/{id}/fundsAvailability`

### 9. Developer Tenant Details (Partial Restriction) ⚠️ MIXED
**File**: `src/app/configuration/developers/[id]/TabsProvider.tsx`  
**Role**: `ADMIN_ROUTE` (line 47)  
**Note**: Developer list and creation is accessible to developers, but some detail tabs are admin-only

---

## Developer-Accessible Features ✅ CAN BE TESTED

### 1. Transaction Operations ✅ FULL ACCESS
**No role restrictions found in**:
- Internal transfers: `POST /transaction/internal/transfer`
- Adjustments: `POST /transaction/adjustment`
- Wire transactions: `POST /transaction/wire/outbound`, `POST /transaction/wire/international`
- Wire inbound: `POST /transaction/wire/inbound`
- Transaction search: `POST /transaction/search`
- ACH returns: `POST /transaction/ach/return`
- Wire returns: `POST /transaction/wire/return`

### 2. Customer & Counterparty Management ✅ FULL ACCESS
**No role restrictions**:
- Create individuals: `POST /individual`
- Create businesses: `POST /business`
- Create counterparties: `POST /counterparty`
- Create UBOs: `POST /business/{id}/ubo`
- Payment instruments: `POST /individual/{id}/paymentInstrument`

### 3. Account Management ✅ FULL ACCESS
- View accounts: `GET /account`
- View balance: `GET /account/{id}/balance`
- Update account: `PATCH /account/{id}`
- Update status: `PATCH /account/{id}/status`

### 4. ACH Processing (Partial) ⚠️ OUTBOUND ONLY
- ✅ Upload outbound ACH files: `POST /ach/load/outbound`
- ✅ View ACH transaction status: `GET /ach/file/status/v2`
- ✅ ACH NOC management: `POST /transaction/search` with `showAchNoc=true`
- ❌ Upload inbound ACH files: `POST /ach/load/inbound` (ADMIN ONLY)
- ❌ ACH settlement approval (ADMIN ONLY)
- ❌ ACH return file management (ADMIN ONLY)

### 5. Wire Processing ✅ FULL ACCESS
- Upload inbound wire files: `POST /wire/load/inbound`
- View wire transaction status: `GET /wire/load/inbound/status`
- Update wire file records: `POST /wire/update-file-record`

**Note**: Wire settlement operations are admin-only, but wire transaction creation and inbound processing are developer-accessible.

### 6. Compliance Workflows ✅ FULL ACCESS
**File**: `src/app/compliance/ofac/page.tsx` - Uses `DEVELOPER_ROUTE` (line 57)
- Alerts: Search, view, assign, resolve, escalate
- OFAC: View hits, update status
- 314(a): Upload files, view matches
- Velocity Limits: Create, search, deactivate

### 7. Configuration (Partial) ⚠️ MIXED
**Developer-Accessible**:
- ✅ Developer management: `src/app/configuration/developers/page.tsx` (DEVELOPER_ROUTE)
- ✅ Create developers: `POST /developer`
- ✅ User management: `src/app/settings/userManagement/page.tsx` ([ADMIN_ROLE, DEVELOPER_ROLE])

**Admin-Only**:
- ❌ Program management
- ❌ Product creation
- ❌ ACH configuration

---

## Impact on Test Coverage

### Tests That CANNOT Be Automated with Developer Role ❌

**From our comprehensive-coverage.md plan:**

#### 04-ach-processing.spec.ts (PARTIAL IMPACT)
**Cannot Test** (5 workflows):
1. ❌ ACH settlement history viewing
2. ❌ Approve settlement file
3. ❌ Send file to SFTP
4. ❌ ACH return file approval
5. ❌ Download return files
6. ❌ Inbound ACH file upload (can only test outbound)

**Can Still Test** (6 workflows):
1. ✅ Outbound ACH file upload
2. ✅ ACH transaction status
3. ✅ ACH NOC handling
4. ✅ ACH return rate monitoring
5. ✅ Unauthorized returns search
6. ✅ File processing errors

**Impact**: ~45% of ACH tests cannot be automated with developer credentials

#### 07-wire-settlement.spec.ts (FULL IMPACT)
**Cannot Test** (7 workflows):
1. ❌ Fetch wire settlement history
2. ❌ Run settlement
3. ❌ Approve settlement
4. ❌ Download settlement file
5. ❌ Wire return files
6. ❌ Run return settlement
7. ❌ Approve return settlement

**Impact**: 100% of wire settlement tests cannot be automated with developer credentials

#### 08-wire-processing.spec.ts (NO IMPACT)
**Can Test** (4 workflows):
1. ✅ Upload inbound wire file
2. ✅ Fetch wire transaction status
3. ✅ Get wire file processing error
4. ✅ Update wire file record

**Impact**: 0% - All wire processing tests are developer-accessible

#### 10-configuration.spec.ts (PARTIAL IMPACT)
**Cannot Test** (4 workflows):
1. ❌ Product creation
2. ❌ ACH config update
3. ❌ Funds availability update
4. ❌ Program management

**Can Test** (2 workflows):
1. ✅ User management
2. ✅ Developer/tenant management

**Impact**: ~67% of configuration tests cannot be automated with developer credentials

---

## Test Coverage Adjustment

### Original Plan: 235 Tests
**Admin-Only Tests to Remove**: ~55 tests

**Breakdown**:
- ACH Settlement (5 workflows × 3 tests) = 15 tests ❌
- Wire Settlement (7 workflows × 3 tests) = 21 tests ❌
- Configuration (4 workflows × 3 tests) = 12 tests ❌
- ACH Inbound Upload (1 workflow × 3 tests) = 3 tests ❌
- Misc admin-only features = 4 tests ❌

### Adjusted Plan: 180 Tests (Developer-Accessible)

**Phase 1 - MVP** (76 tests instead of 91)
| File | Tests | Adjustment |
|------|-------|------------|
| 01-core-workflow | 12 | ✅ No change |
| 02-accounts | 21 | ✅ No change |
| 03-transactions | 25 | ✅ No change |
| 04-ach-processing | 18 | ⚠️ Reduced from 33 (remove settlement tests) |

**Phase 2 - Compliance** (75 tests)
| File | Tests | Adjustment |
|------|-------|------------|
| 05-compliance | 60 | ✅ No change |
| 06-webhooks-events | 15 | ✅ No change |

**Phase 3 - Optional** (29 tests instead of 69)
| File | Tests | Adjustment |
|------|-------|------------|
| 07-wire-processing | 12 | ✅ No change (processing accessible) |
| 08-wire-settlement | 0 | ❌ REMOVED (100% admin-only) |
| 09-reconciliation | 18 | ✅ No change |
| 10-configuration | 6 | ⚠️ Reduced from 18 (only user/dev management) |

---

## Recommendations

### Option 1: Developer Credentials Only (Current Plan) ✅ RECOMMENDED
**Coverage**: 180 tests (77% of original 235)  
**Pros**:
- Matches actual developer workflow
- Tests what developers can actually do
- Aligns with QA plan focus on "Developer role"

**Cons**:
- Missing admin-only settlement workflows
- No program/product configuration testing

### Option 2: Multi-Role Testing (Future Enhancement)
**Coverage**: 235 tests (100%)  
**Requires**:
- Admin credentials in addition to developer
- Separate test suites or conditional test execution
- Role-based test tagging in Playwright

**Implementation**:
```typescript
// Example conditional test
test.describe('Admin-Only Features', () => {
  test.skip(() => !isAdmin, 'Requires admin role');
  
  test('should approve ACH settlement', async () => {
    // Admin-only test
  });
});
```

---

## Summary

**Developer Role Can Access**:
- ✅ All transaction operations (transfers, adjustments, wires)
- ✅ All customer/counterparty management
- ✅ All account management
- ✅ All compliance workflows (alerts, OFAC, limits, 314a)
- ✅ ACH outbound file upload and status
- ✅ Wire processing (inbound uploads)
- ✅ Transaction review and returns
- ✅ User management

**Developer Role CANNOT Access**:
- ❌ ACH settlement approval and file sending
- ❌ ACH inbound file upload
- ❌ ACH return file management
- ❌ Wire settlement operations
- ❌ Wire return file management
- ❌ Program creation and management
- ❌ Product creation
- ❌ ACH configuration updates

**Test Impact**: Remove ~55 admin-only tests from plan, leaving **180 comprehensive developer-accessible tests**.

This aligns with the QA plan's stated focus: *"We are going to focus on workflows for Developer role"*.

