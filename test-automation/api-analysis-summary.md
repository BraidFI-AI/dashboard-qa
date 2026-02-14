# Braid API v1.8 - Comprehensive Analysis Summary

**Analysis Date**: February 13, 2026  
**Source**: `braid-open-api-1.8.json`

---

## 1. Entity Hierarchy & Relationships

### Core Entity Model

```
Program (root entity)
├── customerId: integer (FK → Customer)
├── type: FINANCIAL_INSTITUTION | GOVERNMENT | CORPORATION | OTHER
└── operatingModel: NON_LICENSED | LICENSED | REGULATED_FI

Product
├── programId: integer (FK → Program) ⭐ REQUIRED
├── productName: string
├── type: BRAID | STABLECOIN | DEPOSIT_TOKEN
└── customerAccountType: INDIVIDUAL | BUSINESS | BOTH

Account
├── productId: integer (FK → Product) ⭐ REQUIRED
├── customerId: integer (FK → Customer) ⭐ REQUIRED
├── accountNumber: string (unique identifier)
├── accountType: SAVINGS | CHECKING
├── status: ACTIVE | BLOCKED | INACTIVE | CLOSED
├── fundingAccountId: integer (FK → Account, optional)
└── sweepAccountId: integer (FK → Account, optional)

Customer
├── id: integer (PK)
├── type: INDIVIDUAL | BUSINESS | ISSUER
├── status: ACTIVE | BLOCKED | INACTIVE | PENDING_APPROVAL | PENDING | INITIALIZED | PENDING_UNBLOCKED | DELETED
├── cipStatus: NOT_START | PASS | FAIL | IN_REVIEW | VERIFIED
├── subType: UBO | CUSTOMER | USER
└── (created via /individual or /business endpoints, auto-creates default account)

Counterparty
├── id: integer (PK)
├── type: BUSINESS | INDIVIDUAL
├── status: ACTIVE | BLOCKED | NEEDS_OFAC | PENDING_UNBLOCK | DELETED
├── associatedEntityType: BUSINESS_CUSTOMER | INDIVIDUAL_CUSTOMER | ACCOUNT | PRODUCT
├── associatedEntityId: integer (FK to associated entity)
└── paymentInstruments: array (bank account info for ACH/Wire)

Transaction
├── transactionType: enum (100+ types)
├── status: POSTED | PENDING | CANCELLED | REJECTED_* | RETURNED | FAILED
├── accountNumber: string (FK → Account)
├── counterpartyId: integer (FK → Counterparty, for ACH/Wire)
└── amount: number
```

### Foreign Key Relationships

| Child Entity | Parent Entity | Foreign Key Field | Required? | Notes |
|--------------|---------------|-------------------|-----------|-------|
| **Product** | Program | `programId` | ✅ Yes | Product belongs to a Program |
| **Account** | Product | `productId` | ✅ Yes | Account must have a Product |
| **Account** | Customer | `customerId` | ✅ Yes | Account must have an owner |
| **Account** | Account (self) | `fundingAccountId` | ❌ No | For overdraft protection |
| **Account** | Account (self) | `sweepAccountId` | ❌ No | For automatic sweeps |
| **Transaction** | Account | `accountNumber` | ✅ Yes | Transaction must specify account |
| **Transaction** | Counterparty | `counterpartyId` | Conditional | Required for ACH/Wire transactions |
| **Counterparty** | Various | `associatedEntityId` | ❌ No | Optional association to Customer/Account/Product |

### Creation Dependencies

**To create an Account, you MUST have:**
1. ✅ An existing **Product** (requires `productId`)
2. ✅ An existing **Customer** (requires `customerId`)

**To create a Product, you MUST have:**
1. ✅ An existing **Program** (requires `programId`)

**To create a Customer (Individual/Business):**
1. ✅ Must specify **Product** (requires `productId`) - Creates default account automatically
2. ✅ Address information
3. ✅ ID number (SSN/EIN/etc.)

**To create a Transaction:**
1. ✅ Valid **Account Number** (must exist and be in correct status)
2. ✅ **Counterparty** (for ACH Push/Pull, Wire transactions)
3. ❌ No counterparty needed for internal transfers, adjustments, fees

---

## 2. Critical Endpoints for Testing

### Account Management

#### **GET /account**
- **Purpose**: List accounts (likely with filters)
- **Response**: Array of account objects
- **Test Use**: Verify account listing, filtering

#### **GET /account/{accountNumber}**
- **Purpose**: Get single account details
- **Response**: `AccountResponse`
- **Test Use**: Verify account retrieval by account number

#### **PATCH /account/{accountNumber}**
- **Purpose**: Update account details
- **Request**: `AccountUpdateRequest`
- **Response**: `AccountResponse`
- **Test Use**: Update account name, funding account, sweep account

#### **PUT /account/{accountNumber}/status**
- **Purpose**: Change account status
- **Request**: `AccountStatusUpdateRequest`
  - **Required**: `status` (ACTIVE | BLOCKED | INACTIVE | CLOSED)
- **Response**: Updated account
- **Test Use**: Test status transitions, validate business rules

#### **GET /account/{accountNumber}/balance**
- **Purpose**: Get account balance
- **Response**: `AccountBalance` (likely includes available, pending, etc.)
- **Test Use**: Verify balance calculations after transactions

#### **GET /account/individual/{id}**
- **Purpose**: List accounts for an individual customer
- **Response**: Array of accounts
- **Test Use**: Verify customer-account relationships

#### **GET /account/business/{id}**
- **Purpose**: List accounts for a business customer
- **Response**: Array of accounts
- **Test Use**: Verify customer-account relationships

### Customer Management (Individual)

#### **POST /individual**
- **Purpose**: Create individual customer (auto-creates default account)
- **Request**: `IndividualRequest`
  - **Required Fields**:
    - `firstName`: string (max 40 chars)
    - `lastName`: string (max 40 chars)
    - `address`: AddressRequest object
    - `idNumber`: string (SSN, ITIN, etc.)
    - `productId`: integer ⭐ (determines which product for default account)
  - **Optional Fields**:
    - `middleName`, `email`, `mobilePhone`, `dateOfBirth`
    - `idType`: EIN | SSN | ITIN | PASSPORT | OTHER_ID | DRIVING_LICENSE | NATIONAL_ID_CARD
    - `ach`: Ach config object
    - `subType`: UBO | CUSTOMER | USER
    - `customerToken`, `achCompanyId`, `externalId`
- **Response**: `CustomerResponse` (includes customer ID, account details)
- **Test Use**: Create test individuals, verify account auto-creation

#### **GET /individual/search**
- **Purpose**: Search individuals
- **Request**: Search parameters (likely CustomerSearchRequest)
- **Response**: Array of customers
- **Test Use**: Verify customer search/filtering

#### **GET /individual/{id}**
- **Purpose**: Get individual customer details
- **Response**: `CustomerFullResponse`
- **Test Use**: Verify customer retrieval

#### **PUT /individual/{id}**
- **Purpose**: Update individual customer
- **Request**: Update fields (similar to create)
- **Response**: Updated customer
- **Test Use**: Update customer info, test validation

#### **POST /individual/{id}/document**
- **Purpose**: Upload document for individual
- **Test Use**: Document management testing

### Customer Management (Business)

#### **POST /business**
- **Purpose**: Create business customer (auto-creates default account)
- **Request**: `BusinessRequest`
  - **Required Fields**:
    - `name`: string (business name)
    - `address`: AddressRequest object
    - `businessIdType`: EIN | SSN | OTHER_ID | TIN | DRIVING_LICENSE | NATIONAL_ID_CARD
    - `idNumber`: string (EIN, etc.)
    - `productId`: integer ⭐ (for default account)
  - **Optional Fields**:
    - `mobilePhone`, `email`, `dba`, `website`
    - `businessEntityType`: SOLE_PROPRIETOR | LIMITED_LIABILITY_COMPANY | GENERAL_PARTNERSHIP | PUBLICLY_TRADED_COMPANY | CORPORATION | NON_PROFIT | GOVERNMENT_ORGANIZATION | LIMITED_LIABILITY_PARTNERSHIP
    - `formationDate`, `incorporationState`
    - `mcc` (4 digits), `naics` (6 digits)
    - `ach`, `achCompanyId`, `achCompanyName`
    - `submittedBy`: ContactPerson
    - `externalId`
- **Response**: `CustomerResponse`
- **Test Use**: Create test businesses, verify UBO relationships

#### **GET /business/search**
- **Purpose**: Search businesses
- **Test Use**: Verify business search/filtering

#### **GET /business/{id}**
- **Purpose**: Get business customer details
- **Response**: Business details
- **Test Use**: Verify business retrieval

#### **PUT /business/{id}**
- **Purpose**: Update business customer
- **Test Use**: Update business info

#### **POST /business/{id}/ubo**
- **Purpose**: Add beneficial owner (UBO) to business
- **Test Use**: Verify UBO management

#### **GET /business/{id}/ubo/{uboId}**
- **Purpose**: Get UBO details
- **Response**: `UboResponse`
- **Test Use**: Verify UBO retrieval

### Counterparty Operations

#### **POST /counterparty** (v1)
- **Purpose**: Create counterparty for ACH/Wire transactions
- **Test Use**: Create test counterparties

#### **POST /v2/counterparty** (v2)
- **Purpose**: Create counterparty (V2 API)
- **Response**: `CounterpartyResponseDTO`
- **Test Use**: Create test counterparties with V2 format

#### **GET /counterparty/{id}** (v1)
- **Purpose**: Get counterparty details
- **Response**: `ContactResponse`
- **Test Use**: Verify counterparty retrieval

#### **GET /v2/counterparty/{id}** (v2)
- **Purpose**: Get counterparty details (V2 API)
- **Response**: `CounterpartyResponseDTO`
  - Includes: id, name, phone, email, type, dateOfBirth, idNumber, idType
  - status, associatedEntityType, associatedEntityId
  - address, paymentInstruments (array)
  - ofacId, prohibitedEntityId, tenantId
- **Test Use**: Verify counterparty retrieval with V2 format

#### **PUT /counterparty/{id}** (v1)
- **Purpose**: Update counterparty
- **Request**: `ContactUpdateRequest`
- **Test Use**: Update counterparty details

#### **PUT /v2/counterparty/{id}** (v2)
- **Purpose**: Update counterparty (V2 API)
- **Request**: `UpdateCounterpartyRequestDTO`
- **Test Use**: Update counterparty with V2 format

#### **GET /counterparty/search**
- **Purpose**: Search counterparties
- **Test Use**: Verify counterparty search/filtering

### Transaction Operations

#### **ACH Push (Originator Credit)**

**POST /transaction/ach/push**
- **Purpose**: Send ACH payment to external account
- **Request**: `TransactionAchPushRequest`
  - **Required**:
    - `accountNumber`: string (source account)
    - `amount`: number
    - `counterpartyId`: integer (recipient)
    - `description`: string (1-255 chars, first 10 chars = Company Entry Desc)
    - `secCode`: CCD | CIE | PPD | TEL | WEB | IAT
  - **Optional**:
    - `internalNote`: string (max 255 chars)
    - `effectiveEntryDate`: date (must be valid EED)
    - `externalId`: string (tracking ID)
    - `prenote`: boolean (if true, amount must be 0)
    - `counterparty`: AchCounterpartyContactRequest (inline counterparty)
    - `service`: STANDARD | SAME_DAY
    - `addenda`: string (max 80 chars, optional payment info)
- **Response**: Transaction details with paymentId
- **Test Use**: Test ACH origination, validate amount limits, test prenotes

#### **ACH Pull (Originator Debit)**

**POST /transaction/ach/pull**
- **Purpose**: Pull funds from external account via ACH
- **Request**: `TransactionAchPullRequest` (identical structure to push)
  - **Required**: accountNumber, amount, counterpartyId, description, secCode
  - **Optional**: Same as push
- **Response**: Transaction details
- **Test Use**: Test ACH debits, validate authorization, test velocity limits

#### **ACH Withdrawal**

**POST /transaction/ach/withdrawal**
- **Purpose**: Withdraw funds from account via ACH
- **Request**: `TransactionAchWithdrawalRequest`
- **Test Use**: Test withdrawal operations

#### **ACH Funding**

**POST /transaction/ach/funding**
- **Purpose**: Fund account via ACH
- **Request**: `TransactionAchFundingRequest`
- **Test Use**: Test account funding operations

#### **ACH Reversal**

**POST /transaction/ach/reverse**
- **Purpose**: Reverse an ACH transaction
- **Request**: `TransactionAchReversalRequest`
- **Test Use**: Test ACH reversals within allowed timeframe

#### **Wire Domestic**

**POST /transaction/wire/outbound**
- **Purpose**: Send domestic wire transfer
- **Request**: `TransactionWireDomesticRequest`
  - **Required**:
    - `accountNumber`: string
    - `amount`: number
    - `counterpartyId`: integer
    - `description`: string (1-255 chars)
  - **Optional**:
    - `internalNote`: string (max 255 chars)
    - `externalId`: string (max 255 chars)
- **Response**: Transaction details
- **Test Use**: Test domestic wire, validate high-value transactions

#### **Wire International**

**POST /transaction/wire/international** (v1)
**POST /v2/transaction/wire/international** (v2)
- **Purpose**: Send international wire transfer (with FX)
- **Request**: `TransactionWireInternationalRequestV2`
  - **Required**:
    - `accountNumber`: string
    - `counterpartyId`: integer
    - `creditCurrency`: string (3 chars, ISO 4217, e.g., "EUR")
    - `debitCurrency`: string (3 chars, currently must be "USD")
    - `description`: string (1-255 chars)
  - **Must provide ONE of**:
    - `creditAmount`: number (amount beneficiary receives)
    - OR `debitAmount`: number (amount deducted from account)
  - **Optional**:
    - `internalNote`: string (max 255 chars)
    - `externalId`: string (max 255 chars)
    - `fxQuoteId`: string (UUID, pre-obtained FX quote)
- **Response**: Transaction details
- **Test Use**: Test international wire, FX conversion, multi-currency

#### **FX Quote**

**POST /transaction/fx/quote**
- **Purpose**: Get foreign exchange quote for international wire
- **Test Use**: Obtain FX quote before initiating international wire

#### **Internal Transfer (Account-to-Account)**

**POST /transaction/internal/transfer**
- **Purpose**: Transfer funds between two accounts in the system
- **Request**: `InternalTransactionRequest`
  - **Required**:
    - `senderAccountNumber`: string
    - `recipientAccountNumber`: string
    - `amount`: number
    - `description`: string (1-255 chars)
  - **Optional**:
    - `internalNote`: string (max 255 chars)
    - `externalId`: string (max 255 chars)
- **Response**: Transaction details
- **Test Use**: Test internal transfers, validate account ownership, test instant settlement

#### **FedNow (Real-Time Payments)**

**POST /transaction/fednow**
- **Purpose**: Send FedNow instant payment
- **Request**: `TransactionFedNowOutboundRequest`
- **Test Use**: Test real-time payment processing

#### **Credit Adjustment**

**POST /transaction/credit_to**
- **Purpose**: Apply credit adjustment to account
- **Request**: Likely includes accountNumber, amount, reason
- **Test Use**: Test manual adjustments, corrections

#### **One-time Fee**

**POST /transaction/fee/onetime**
- **Purpose**: Apply one-time fee to account
- **Request**: `TransactionOnetimeFeeRequest`
- **Test Use**: Test fee applications

#### **Transaction Search**

**POST /transaction/search**
- **Purpose**: Search transactions with filters
- **Request**: `TransactionSearchRequest`
- **Response**: Paginated transaction list
- **Test Use**: Verify transaction history, filtering, pagination

#### **Transaction Batch**

**POST /transaction/batch**
- **Purpose**: Create batch of transactions
- **Request**: `TransactionBatchRequest` (array of transactions)
- **Response**: `TransactionBatch` with batch ID
- **Test Use**: Test bulk transaction processing

**GET /transaction/batch/{batchId}**
- **Purpose**: Get batch status and results
- **Test Use**: Verify batch processing, check individual transaction statuses

#### **Pending Transaction Approval**

**PUT /transaction/pending/approve**
- **Purpose**: Approve pending transaction (developer/dual approval workflow)
- **Request**: `PendingTransactionApproveRequest`
- **Response**: Approved transaction
- **Test Use**: Test approval workflows, dual control

#### **Pending Transaction Cancellation**

**PUT /transaction/pending/cancel**
- **Purpose**: Cancel pending transaction
- **Request**: `PendingTransactionRejectRequest`
- **Response**: Cancelled transaction
- **Test Use**: Test transaction cancellation

#### **Transaction Groups**

**GET /transaction/groups**
- **Purpose**: Get grouped transaction view
- **Response**: `TransactionGroupResponse`
- **Test Use**: Verify transaction grouping (e.g., original + returns)

#### **Transaction Types**

**GET /transaction/transactionTypes**
- **Purpose**: Get list of available transaction types
- **Response**: Array of `TransactionTypeResponse`
- **Test Use**: Understand available transaction types

**GET /transaction/transactionTypeData**
- **Purpose**: Get transaction type metadata
- **Test Use**: Get configuration for transaction types

### ACH Processing (File & Settlement)

#### **GET /ach/file/status/v2**
- **Purpose**: Get ACH settlement file status
- **Response**: Array of `AchSettlementFile`
  - Fields: filename, status, createdAt, sentAt, confirmedAt
  - Status: INITIATED | MANUAL_REVIEW | CANCELED | SUBMITTED | SENT | RETURNED | REJECTED | CONFIRMED | ACCEPTED | DISHONORED | DEVELOPER_REVIEW | PENDING_SENT
  - fileCategory: DOWNLOADED | UPLOADED | DOWNLOADED_ACK | UPLOADED_RETURNS | FED_CONFIRMATION
  - sftpStatus: NOT_START | FAIL | SUCCESS | MANUAL_REVIEW | PENDING_SENT
- **Test Use**: Monitor ACH file processing, verify settlement workflow

#### **POST /ach/load/outbound**
- **Purpose**: Load/generate outbound ACH file
- **Test Use**: Test ACH file generation

#### **Simulation Endpoints** (Test Environment Only)

**POST /simulation/ach/inbound**
- **Purpose**: Simulate incoming ACH transaction
- **Test Use**: Test receiving ACH deposits/debits

**POST /simulation/ach/noc**
- **Purpose**: Simulate ACH Notification of Change (NOC)
- **Test Use**: Test NOC processing, account info updates

**POST /simulation/ach/outbound/return**
- **Purpose**: Simulate ACH return for outbound transaction
- **Test Use**: Test return handling, NSF, unauthorized returns

### Wire Processing

**POST /simulation/wire/inbound**
- **Purpose**: Simulate incoming wire
- **Test Use**: Test receiving wire transfers

**POST /simulation/wire/outbound/return**
- **Purpose**: Simulate wire return
- **Test Use**: Test wire return handling

**POST /transaction/wire/return**
- **Purpose**: Return a wire transaction
- **Request**: Wire return details
- **Test Use**: Test wire return operations

### Compliance (Alerts & RFI)

#### **POST /alerts/search**
- **Purpose**: Search compliance alerts
- **Request**: `AlertsSearchRequest`
  - **Filters**:
    - `types`: array (OFAC | LIST_314A | DUAL_APPROVAL)
    - `statuses`: array (ASSIGNED | UNASSIGNED | CLOSED)
    - `contextType`, `contextId`: Filter by entity
    - `showAssigned`: boolean
    - `alertId`: specific alert
    - `rfiStatus`: REQUESTED | PROVIDED | COMPLETED
    - `assignee`: username
    - `startDate`, `endDate`: date range
    - `includeDetails`: boolean
- **Response**: Array of alerts
- **Test Use**: Verify alert search, filtering

#### **GET /alerts/{alertId}**
- **Purpose**: Get alert details
- **Test Use**: Verify alert retrieval

#### **PUT /alerts/{alertId}**
- **Purpose**: Update alert (assign, close, etc.)
- **Test Use**: Test alert workflow

#### **POST /alerts/{alertId}/add-note**
- **Purpose**: Add note to alert
- **Test Use**: Test alert documentation

#### **POST /alerts/rfi/{alertId}**
- **Purpose**: Request additional information for alert
- **Test Use**: Test RFI workflow

#### **POST /alerts/{alertId}/create-document**
- **Purpose**: Create document for alert
- **Test Use**: Test alert documentation

### Fee Management

#### **GET /fee/{id}** (v1)
- **Purpose**: Get fee details
- **Response**: `FeeResponse`
- **Test Use**: Verify fee retrieval

#### **GET /v2/fee/{id}** (v2)
- **Purpose**: Get fee details (V2 API)
- **Response**: `FeeResponseDTO`
- **Test Use**: Verify fee retrieval with V2 format

#### **PUT /fee/{id}** (v1)
- **Purpose**: Update fee
- **Request**: `FeeRequest`
- **Test Use**: Update fee configuration

#### **PUT /v2/fee/{id}** (v2)
- **Purpose**: Update fee (V2 API)
- **Request**: `UpdateFeeRequestDTO`
- **Test Use**: Update fee with V2 format

#### **GET /v2/fee/active**
- **Purpose**: Get active fees
- **Test Use**: List active fee configurations

#### **POST /fee**
- **Purpose**: Create new fee
- **Test Use**: Create fee configurations

### Identity Verification

#### **POST /identity-verification**
- **Purpose**: Initiate identity verification
- **Test Use**: Test KYC/CIP workflows

#### **GET /identity-verification/{customerId}**
- **Purpose**: Get verification status for customer
- **Test Use**: Check CIP status

### Statements

#### **GET /statement/product/{productId}**
- **Purpose**: Get statements for a product
- **Test Use**: Verify statement generation

### Webhooks

#### **GET /webhook/{id}**
- **Purpose**: Get webhook configuration
- **Test Use**: Verify webhook setup

### Event Webhooks (Read-Only)

The API provides webhook events for monitoring:

- **Account Events**: ACCOUNT_CREATED, ACCOUNT_TO_ACCOUNT
- **ACH Events**: 
  - Inbound: ACH_INBOUND_POSTED, ACH_INBOUND_CANCELLED, ACH_INBOUND_RETURNED, ACH_INBOUND_MANUAL_REVIEW, ACH_INBOUND_REJECTED
  - Outbound: ACH_OUTBOUND_POSTED, ACH_ORIGINATION_SUBMITTED, ACH_ORIGINATION_SENT, ACH_ORIGINATION_RETURNED, ACH_ORIGINATION_CANCELED, ACH_ORIGINATION_MANUAL_REVIEW, ACH_ORIGINATION_REJECTED
  - Other: ACH_NOC
- **Wire Events**:
  - Inbound: WIRE_INBOUND_POSTED, WIRE_INBOUND_CANCELLED, WIRE_INBOUND_RETURNED, WIRE_INBOUND_MANUAL_REVIEW
  - Outbound: WIRE_OUTBOUND_SUBMITTED, WIRE_OUTBOUND_SENT, WIRE_OUTBOUND_POSTED, WIRE_OUTBOUND_CANCELED
- **Compliance**: ALERT_CREATED, RFI_STATUS_UPDATE
- **Customer**: CUSTOMER_CIP_UPDATE, CUSTOMER_STATUS, COUNTERPARTY_STATUS
- **Other**: FED_SETTLEMENT_FILE_PARSING_RESULT, SAVINGS_ACCOUNT_INTEREST_PAYOUT_POSTED

---

## 3. Required Fields & Dependencies

### Creating an Individual Customer

**Endpoint**: `POST /individual`

**Required Fields**:
- ✅ `firstName`: string (max 40 chars)
- ✅ `lastName`: string (max 40 chars)
- ✅ `address`: AddressRequest object
- ✅ `idNumber`: string (SSN, ITIN, etc.)
- ✅ `productId`: integer (FK to Product - determines default account product)

**Optional But Important**:
- `email`: string (for notifications)
- `mobilePhone`: string (for 2FA, notifications)
- `dateOfBirth`: date
- `idType`: EIN | SSN | ITIN | PASSPORT | OTHER_ID | DRIVING_LICENSE | NATIONAL_ID_CARD (defaults to SSN)
- `externalId`: string (your system's reference ID)

**Dependencies**:
- Must have a valid **Product** with `productId`
- Product must allow INDIVIDUAL customers (`customerAccountType` = INDIVIDUAL or BOTH)
- Product must be ACTIVE

**Result**:
- Creates Customer record
- Auto-creates default Account for the customer
- Returns `CustomerResponse` with customer ID and account details

### Creating a Business Customer

**Endpoint**: `POST /business`

**Required Fields**:
- ✅ `name`: string (business name)
- ✅ `address`: AddressRequest object
- ✅ `businessIdType`: EIN | SSN | OTHER_ID | TIN | DRIVING_LICENSE | NATIONAL_ID_CARD
- ✅ `idNumber`: string (EIN, etc.)
- ✅ `productId`: integer (FK to Product)

**Optional But Important**:
- `email`, `mobilePhone`
- `dba`: string (doing business as)
- `businessEntityType`: SOLE_PROPRIETOR | LIMITED_LIABILITY_COMPANY | GENERAL_PARTNERSHIP | PUBLICLY_TRADED_COMPANY | CORPORATION | NON_PROFIT | GOVERNMENT_ORGANIZATION | LIMITED_LIABILITY_PARTNERSHIP
- `formationDate`: date
- `incorporationState`: string (2-letter state code)
- `website`: string (URL)
- `mcc`: string (4 digits - Merchant Category Code)
- `naics`: string (6 digits - North American Industry Classification)
- `submittedBy`: ContactPerson (authorized representative)
- `achCompanyId`: string (for ACH origination, defaults to EIN)
- `achCompanyName`: string (for ACH files, defaults to business name)
- `externalId`: string

**Dependencies**:
- Must have a valid **Product** with `productId`
- Product must allow BUSINESS customers (`customerAccountType` = BUSINESS or BOTH)
- Product must be ACTIVE

**Result**:
- Creates Customer record (type=BUSINESS)
- Auto-creates default Account
- Can add UBOs (Beneficial Owners) via `/business/{id}/ubo`

### Creating a Counterparty

**Endpoint**: `POST /v2/counterparty`

**Required Fields** (schema not fully shown, but typical):
- ✅ `name`: string
- ✅ `type`: BUSINESS | INDIVIDUAL
- ✅ Payment instrument details (bank account info):
  - Account number
  - Routing number
  - Account type (CHECKING | SAVINGS)

**Optional**:
- `email`, `phone`
- `address`
- `dateOfBirth` (for individuals)
- `idNumber`, `idType`
- `associatedEntityType`, `associatedEntityId` (link to customer/account)

**Dependencies**:
- None (can be standalone or associated with customer/account)

**Result**:
- Creates Counterparty record
- Can be used in ACH/Wire transactions

### Creating an ACH Push Transaction

**Endpoint**: `POST /transaction/ach/push`

**Required Fields**:
- ✅ `accountNumber`: string (must be ACTIVE account)
- ✅ `amount`: number (must be > 0 unless prenote)
- ✅ `counterpartyId`: integer (must be ACTIVE counterparty with valid payment instrument)
- ✅ `description`: string (1-255 chars, first 10 become Company Entry Description)
- ✅ `secCode`: CCD | CIE | PPD | TEL | WEB | IAT

**Optional**:
- `service`: STANDARD | SAME_DAY (affects processing time)
- `effectiveEntryDate`: date (must be valid banking day)
- `prenote`: boolean (if true, amount must be 0)
- `addenda`: string (max 80 chars)
- `externalId`: string (your tracking ID)
- `internalNote`: string (max 255 chars, internal only)

**Dependencies**:
- ✅ Account must exist and status = ACTIVE
- ✅ Account must have sufficient balance (for push/debit from account)
- ✅ Counterparty must exist and status = ACTIVE
- ✅ Counterparty must have valid payment instrument
- ✅ Customer must be in valid status (ACTIVE)
- ✅ Must pass OFAC check (if enabled on product)
- ✅ Must pass velocity limits (if configured)
- ✅ Must be within product's transaction windows

**Business Rules**:
- If `prenote` = true, amount MUST be 0
- `effectiveEntryDate` must be a valid banking day (consider holidays)
- Same Day ACH has cutoff times (varies by bank)
- SEC codes have specific use cases (CCD=business, PPD=personal, WEB=web-initiated, etc.)

### Creating a Wire Transfer

**Endpoint**: `POST /transaction/wire/outbound` (domestic)

**Required Fields**:
- ✅ `accountNumber`: string
- ✅ `amount`: number (typically higher minimum than ACH)
- ✅ `counterpartyId`: integer (must have wire-compatible payment instrument)
- ✅ `description`: string (1-255 chars)

**Optional**:
- `externalId`: string
- `internalNote`: string

**Dependencies**:
- Same as ACH, plus:
- ✅ Account must have sufficient balance (wires are typically same-day/real-time)
- ✅ May require dual approval based on amount thresholds
- ✅ Stricter OFAC/compliance checks

### Creating International Wire

**Endpoint**: `POST /v2/transaction/wire/international`

**Required Fields**:
- ✅ `accountNumber`: string
- ✅ `counterpartyId`: integer (must have international wire details: SWIFT, IBAN, etc.)
- ✅ `creditCurrency`: string (3-char ISO 4217, e.g., "EUR", "GBP", "JPY")
- ✅ `debitCurrency`: string (currently must be "USD")
- ✅ `description`: string (1-255 chars)
- ✅ **Either** `creditAmount` **OR** `debitAmount` (not both)

**Optional**:
- `fxQuoteId`: string (UUID from prior `/transaction/fx/quote` call)
- `externalId`: string
- `internalNote`: string

**Dependencies**:
- All wire dependencies plus:
- ✅ If no `fxQuoteId` provided, system auto-obtains FX quote
- ✅ Counterparty must have international payment details (SWIFT code, IBAN, beneficiary bank address, etc.)
- ✅ Higher compliance scrutiny (OFAC, sanctions, international regulations)

### Creating Internal Transfer

**Endpoint**: `POST /transaction/internal/transfer`

**Required Fields**:
- ✅ `senderAccountNumber`: string
- ✅ `recipientAccountNumber`: string
- ✅ `amount`: number
- ✅ `description`: string (1-255 chars)

**Optional**:
- `externalId`: string
- `internalNote`: string

**Dependencies**:
- ✅ Both accounts must exist and be ACTIVE
- ✅ Sender account must have sufficient balance
- ✅ Both accounts should be in the same product/program (or cross-product transfers allowed)
- ✅ No counterparty needed (internal)

**Result**:
- Creates two transactions: debit from sender, credit to recipient
- Typically instant settlement

---

## 4. Transaction Types

### Comprehensive Transaction Type Enum

The API supports **100+ transaction types**. Here are the main categories:

#### **Adjustments**
- `ADJUSTMENT_CREDIT` - Manual credit adjustment
- `ADJUSTMENT_DEBIT` - Manual debit adjustment

#### **ACH Transactions**

**Deposits & Withdrawals** (Account holder initiated):
- `ACH_DEPOSIT` - Incoming ACH deposit to account
- `ACH_WITHDRAWAL` - Outgoing ACH withdrawal from account

**Originator** (Your bank sending ACH):
- `ACH_ORIGINATOR_CREDIT` - ACH credit originated (push to external, e.g., ACH push)
- `ACH_ORIGINATOR_DEBIT` - ACH debit originated (pull from external, e.g., ACH pull)
- `ACH_ORIGINATOR_IAT_CREDIT` - International ACH Transaction credit
- `ACH_ORIGINATOR_IAT_DEBIT` - International ACH Transaction debit

**Receiver** (Your bank receiving ACH):
- `ACH_RECEIVER_CREDIT` - ACH credit received from external
- `ACH_RECEIVER_DEBIT` - ACH debit received from external
- `ACH_RECEIVER_CREDIT_EXCEPTION` - Received credit requiring review
- `ACH_RECEIVER_DEBIT_EXCEPTION` - Received debit requiring review
- `ACH_RECEIVER_CREDIT_RETURN` - Return of received credit

**Returns** (Original transaction returned):
- `ACH_RETURNED_DEPOSIT` - Returned deposit
- `ACH_RETURNED_WITHDRAWAL` - Returned withdrawal
- `ACH_RETURNED_ORIGINATOR_CREDIT` - Returned originator credit
- `ACH_RETURNED_ORIGINATOR_DEBIT` - Returned originator debit
- `ACH_RETURNED_NSF_ORIGINATOR_DEBIT` - Returned due to NSF (R01)
- `ACH_RETURNED_ADMIN_*` - Administrative returns
- `ACH_RETURNED_UNAUTH_*` - Unauthorized returns (R10, R11)
- `ACH_RETURNED_RECEIVER_DEBIT` - Return of receiver debit
- `ACH_DISHONORED_RETURN_CREDIT` - Dishonored return credit
- `ACH_DISHONORED_RETURN_DEBIT` - Dishonored return debit

**Reversals**:
- `ACH_REVERSAL_CREDIT` - Reversal of ACH credit
- `ACH_REVERSAL_DEBIT` - Reversal of ACH debit

#### **Wire Transactions**

**Domestic**:
- `WIRE_DOMESTIC_CREDIT` - Incoming domestic wire
- `WIRE_DOMESTIC_DEBIT` - Outgoing domestic wire
- `WIRE_DOMESTIC_CREDIT_EXCEPTION` - Incoming wire requiring review
- `WIRE_DOMESTIC_CREDIT_RETURN` - Return of domestic wire credit
- `WIRE_DOMESTIC_DEBIT_RETURN` - Return of domestic wire debit

**International**:
- `WIRE_INTERNATIONAL_CREDIT` - Incoming international wire
- `WIRE_INTERNATIONAL_DEBIT` - Outgoing international wire
- `WIRE_INTERNATIONAL_CREDIT_EXCEPTION` - Incoming intl wire requiring review
- `WIRE_INTERNATIONAL_CREDIT_RETURN` - Return of intl wire credit
- `WIRE_INTERNATIONAL_DEBIT_RETURN` - Return of intl wire debit

**Wire Drawdown** (Bank-initiated):
- `WIRE_DRAWDOWN_DOMESTIC_CREDIT` - Domestic wire drawdown credit
- `WIRE_DRAWDOWN_DOMESTIC_DEBIT` - Domestic wire drawdown debit
- `WIRE_DRAWDOWN_DOMESTIC_CREDIT_EXCEPTION`
- `WIRE_DRAWDOWN_DOMESTIC_DEBIT_EXCEPTION`
- `WIRE_DRAWDOWN_INTERNATIONAL_CREDIT`
- `WIRE_DRAWDOWN_INTERNATIONAL_DEBIT`
- `WIRE_DRAWDOWN_INTERNATIONAL_CREDIT_EXCEPTION`
- `WIRE_DRAWDOWN_INTERNATIONAL_DEBIT_EXCEPTION`

#### **Internal Transfers**
- `ME_TO_ME` - Transfer between own accounts (same customer)
- `ME_TO_YOU` - Transfer to different customer account

#### **Fees**
- `FEE` - Generic fee
- `FEE_ACH` - ACH transaction fee
- `FEE_ACH_TRANSACTION` - Per-transaction ACH fee
- `FEE_ACH_DISCOUNT` - ACH fee discount
- `FEE_ACH_RETURNED` - Fee for returned ACH
- `FEE_ACH_RETURNED_ADMIN` - Admin return fee
- `FEE_ACH_RETURNED_UNAUTH` - Unauthorized return fee
- `FEE_ACH_RETURNED_NSF` - NSF return fee
- `FEE_MISC` - Miscellaneous fee
- `FEE_MONTHLY` - Monthly maintenance fee
- `WIRE_DOM_DEBIT_FEE` - Domestic wire send fee
- `WIRE_INTL_DEBIT_FEE` - International wire send fee
- `WIRE_DOM_CREDIT_FEE` - Domestic wire receive fee
- `WIRE_INTL_CREDIT_FEE` - International wire receive fee

#### **FedNow (Real-Time Payments)**
- `FEDNOW_CREDIT` - Incoming FedNow payment
- `FEDNOW_DEBIT` - Outgoing FedNow payment
- `FEDNOW_CREDIT_RETURN` - FedNow credit return
- `FEDNOW_DEBIT_RETURN` - FedNow debit return
- `FEDNOW_CREDIT_EXCEPTION` - FedNow credit requiring review
- `FEDNOW_DEBIT_EXCEPTION` - FedNow debit requiring review

#### **Other Transaction Types**
- `ECOMMERCE` - E-commerce transaction
- `POS` - Point of sale transaction
- `FUNDING_ACCOUNT_TSF` - Funding account transfer (overdraft protection)
- `FUNDING_CANCELED_CREDIT` - Funding canceled credit
- `FUNDING_CANCELED_DEBIT` - Funding canceled debit
- `SWEEP_ACCOUNT` - Sweep to/from sweep account
- `CHECK_DEPOSIT` - Check deposit
- `CHECK_DEPOSIT_RETURN` - Returned check
- `CHECK_CLEARED_DEBIT` - Check cleared
- `FURTHER_CREDIT_TO` - Further credit to beneficiary
- `INTEREST_PAYOUT` - Interest payment credit
- `INTEREST_PAYMENTS_DEBIT` - Interest payment debit
- `TEST_DEBIT` - Test transaction

---

## 5. Account States & Statuses

### Account Status Field

**Enum Values**: `status`
- `ACTIVE` - Account is fully operational, can send & receive transactions
- `BLOCKED` - Account is blocked, cannot perform transactions (compliance hold, fraud, etc.)
- `INACTIVE` - Account is inactive but not closed (dormant, pending activation)
- `CLOSED` - Account is permanently closed, no transactions allowed

### Valid Status Transitions

**Recommended Status Transition Flow**:

```
ACTIVE ←→ BLOCKED
  ↓
INACTIVE
  ↓
CLOSED (final state, typically irreversible)
```

**Transition Rules** (inferred from best practices):

| From Status | To Status | Valid? | Notes |
|-------------|-----------|--------|-------|
| ACTIVE | BLOCKED | ✅ Yes | Temporary hold (compliance, fraud, customer request) |
| ACTIVE | INACTIVE | ✅ Yes | Account being deactivated |
| ACTIVE | CLOSED | ✅ Yes | Direct closure from active |
| BLOCKED | ACTIVE | ✅ Yes | Unblock/release hold |
| BLOCKED | INACTIVE | ✅ Yes | Moving to inactive while blocked |
| BLOCKED | CLOSED | ✅ Yes | Closing blocked account |
| INACTIVE | ACTIVE | ✅ Yes | Reactivating dormant account |
| INACTIVE | BLOCKED | ⚠️ Maybe | Blocking inactive account |
| INACTIVE | CLOSED | ✅ Yes | Closing inactive account |
| CLOSED | * | ❌ No | Closed is final state (create new account instead) |

**Status Update Endpoint**: `PUT /account/{accountNumber}/status`
- **Request**: `AccountStatusUpdateRequest` with `status` field
- **Business Rules**:
  - Cannot close account with non-zero balance (must transfer out first)
  - Cannot reopen CLOSED accounts
  - Status changes may trigger notifications/webhooks
  - Compliance holds take precedence (may prevent status changes)

### Account Operational Constraints by Status

| Operation | ACTIVE | BLOCKED | INACTIVE | CLOSED |
|-----------|--------|---------|----------|--------|
| **Receive ACH credit** | ✅ Yes | ⚠️ Maybe* | ❌ No | ❌ No |
| **Receive Wire credit** | ✅ Yes | ⚠️ Maybe* | ❌ No | ❌ No |
| **Send ACH debit** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Send Wire debit** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Internal transfer OUT** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Internal transfer IN** | ✅ Yes | ⚠️ Maybe | ❌ No | ❌ No |
| **Apply fees** | ✅ Yes | ⚠️ Maybe | ⚠️ Maybe | ❌ No |
| **View balance** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Update account info** | ✅ Yes | ✅ Yes | ⚠️ Maybe | ❌ No |

\* = Depends on product configuration and reason for block

---

## 6. Test Data Requirements

### Stable Test Data Strategy

To effectively test dashboard flows without creating/destroying data constantly, maintain these **persistent test entities** in Braid Test environment:

### Test Program

```yaml
TEST_PROGRAM:
  programId: 1001  # Sample ID
  name: "CI_TEST_PROGRAM"
  type: "FINANCIAL_INSTITUTION"
  isActive: true
  achOdfi: "123456789"
  operatingModel: "LICENSED"
```

### Test Products (under TEST_PROGRAM)

```yaml
TEST_PRODUCT_CHECKING:
  productId: 2001
  productName: "CI_Test_Checking"
  programId: 1001
  status: "ACTIVE"
  type: "BRAID"
  accountType: "CHECKING"
  customerAccountType: "BOTH"  # Allows individual & business
  currency: "USD"
  cipConfig: "BYPASS"  # For test data
  prefix: "CITEST"

TEST_PRODUCT_SAVINGS:
  productId: 2002
  productName: "CI_Test_Savings"
  programId: 1001
  status: "ACTIVE"
  type: "BRAID"
  accountType: "SAVINGS"
  customerAccountType: "BOTH"
  currency: "USD"
  cipConfig: "BYPASS"
  prefix: "CISAVE"

TEST_PRODUCT_WIRE:
  productId: 2003
  productName: "CI_Test_Wire"
  programId: 1001
  status: "ACTIVE"
  type: "BRAID"
  accountType: "CHECKING"  # Wire typically uses checking
  customerAccountType: "BOTH"
  currency: "USD"
  cipConfig: "BYPASS"
  prefix: "CIWIRE"
```

### Test Individual Customers

```yaml
INDIVIDUAL_1_ACTIVE:
  customerId: 3001
  type: "INDIVIDUAL"
  firstName: "John"
  lastName: "TestUser"
  email: "john.testuser@citest.braid.zone"
  mobilePhone: "+15555551001"
  idNumber: "111-11-1001"  # Test SSN
  status: "ACTIVE"
  cipStatus: "VERIFIED"
  productId: 2001  # Checking
  
INDIVIDUAL_2_HIGHVOLUME:
  customerId: 3002
  type: "INDIVIDUAL"
  firstName: "Sarah"
  lastName: "HighVolume"
  email: "sarah.highvolume@citest.braid.zone"
  mobilePhone: "+15555551002"
  idNumber: "111-11-1002"
  status: "ACTIVE"
  cipStatus: "VERIFIED"
  productId: 2001
  # Use for velocity limit testing

INDIVIDUAL_3_BLOCKED:
  customerId: 3003
  type: "INDIVIDUAL"
  firstName: "Bob"
  lastName: "Blocked"
  email: "bob.blocked@citest.braid.zone"
  mobilePhone: "+15555551003"
  idNumber: "111-11-1003"
  status: "BLOCKED"
  cipStatus: "VERIFIED"
  productId: 2001
  # Use for testing blocked customer scenarios
```

### Test Business Customers

```yaml
BUSINESS_1_ACTIVE:
  customerId: 4001
  type: "BUSINESS"
  name: "Test Corp LLC"
  email: "corp@citest.braid.zone"
  mobilePhone: "+15555554001"
  idNumber: "11-1111001"  # Test EIN
  businessIdType: "EIN"
  businessEntityType: "LIMITED_LIABILITY_COMPANY"
  status: "ACTIVE"
  cipStatus: "VERIFIED"
  productId: 2001
  achCompanyId: "1111001"
  achCompanyName: "TEST CORP"
  
BUSINESS_2_SOLE_PROP:
  customerId: 4002
  type: "BUSINESS"
  name: "Jane's Consulting"
  email: "jane.consulting@citest.braid.zone"
  idNumber: "111-11-2001"  # Sole prop can use SSN
  businessIdType: "SSN"
  businessEntityType: "SOLE_PROPRIETOR"
  status: "ACTIVE"
  cipStatus: "VERIFIED"
  productId: 2001
```

### Test Accounts

```yaml
ACCOUNT_1_CHECKING_FUNDED:
  accountNumber: "CITEST1001000001"
  accountName: "John TestUser - Checking"
  productId: 2001
  customerId: 3001
  accountType: "CHECKING"
  status: "ACTIVE"
  balance: 10000.00  # $10k balance
  # Use for: ACH push, wire send, internal transfers OUT

ACCOUNT_2_CHECKING_EMPTY:
  accountNumber: "CITEST1001000002"
  accountName: "John TestUser - Checking 2"
  productId: 2001
  customerId: 3001
  accountType: "CHECKING"
  status: "ACTIVE"
  balance: 0.00
  # Use for: receiving transactions, insufficient funds tests

ACCOUNT_3_SAVINGS_FUNDED:
  accountNumber: "CISAVE1002000001"
  accountName: "Sarah HighVolume - Savings"
  productId: 2002
  customerId: 3002
  accountType: "SAVINGS"
  status: "ACTIVE"
  balance: 50000.00  # $50k balance
  # Use for: velocity limit testing, large transactions

ACCOUNT_4_BLOCKED:
  accountNumber: "CITEST1001000003"
  accountName: "Bob Blocked - Checking"
  productId: 2001
  customerId: 3003
  accountType: "CHECKING"
  status: "BLOCKED"
  balance: 1000.00
  # Use for: testing blocked account scenarios

ACCOUNT_5_BUSINESS_CHECKING:
  accountNumber: "CITEST1001000004"
  accountName: "Test Corp LLC - Operating"
  productId: 2001
  customerId: 4001
  accountType: "CHECKING"
  status: "ACTIVE"
  balance: 25000.00  # $25k balance
  # Use for: business transactions, ACH origination

ACCOUNT_6_WIRE:
  accountNumber: "CIWIRE1003000001"
  accountName: "John TestUser - Wire Account"
  productId: 2003
  customerId: 3001
  accountType: "CHECKING"
  status: "ACTIVE"
  balance: 100000.00  # $100k for wire testing
  # Use for: wire transfers, high-value transactions
```

### Test Counterparties

```yaml
COUNTERPARTY_1_ACH_INDIVIDUAL:
  counterpartyId: 5001
  name: "External Bank - Jane Doe"
  type: "INDIVIDUAL"
  status: "ACTIVE"
  email: "jane.external@example.com"
  associatedEntityType: "INDIVIDUAL_CUSTOMER"
  associatedEntityId: 3001  # John TestUser
  paymentInstruments:
    - type: "ACH"
      accountNumber: "1234567890"
      routingNumber: "021000021"  # Chase routing number (test)
      accountType: "CHECKING"
  # Use for: ACH push/pull transactions

COUNTERPARTY_2_ACH_BUSINESS:
  counterpartyId: 5002
  name: "External Corp"
  type: "BUSINESS"
  status: "ACTIVE"
  email: "payments@externalcorp.com"
  associatedEntityType: "BUSINESS_CUSTOMER"
  associatedEntityId: 4001  # Test Corp LLC
  paymentInstruments:
    - type: "ACH"
      accountNumber: "9876543210"
      routingNumber: "021000021"
      accountType: "CHECKING"
  # Use for: business ACH transactions

COUNTERPARTY_3_WIRE_DOMESTIC:
  counterpartyId: 5003
  name: "Wire Recipient - Domestic"
  type: "INDIVIDUAL"
  status: "ACTIVE"
  associatedEntityType: "INDIVIDUAL_CUSTOMER"
  associatedEntityId: 3001
  paymentInstruments:
    - type: "WIRE"
      accountNumber: "1111222233"
      routingNumber: "021000021"
      accountType: "CHECKING"
      bankName: "Chase Bank"
      bankAddress: "123 Bank St, New York, NY 10001"
  # Use for: domestic wire transfers

COUNTERPARTY_4_WIRE_INTERNATIONAL:
  counterpartyId: 5004
  name: "International Wire Recipient"
  type: "BUSINESS"
  status: "ACTIVE"
  paymentInstruments:
    - type: "WIRE_INTERNATIONAL"
      iban: "GB29NWBK60161331926819"
      swiftCode: "CHASUS33"
      accountNumber: "111122223333"
      currency: "GBP"
      bankName: "HSBC UK"
      bankAddress: "8 Canada Square, London E14 5HQ, UK"
      beneficiaryName: "UK Business Ltd"
      beneficiaryAddress: "10 Business St, London, UK"
  # Use for: international wire transfers, FX testing

COUNTERPARTY_5_BLOCKED:
  counterpartyId: 5005
  name: "Blocked Counterparty"
  type: "INDIVIDUAL"
  status: "BLOCKED"
  # Use for: testing blocked counterparty scenarios
```

### Test Transaction Scenarios

Using the stable test data above, you can test these scenarios **without creating new data**:

#### ACH Testing:
- **ACH Push**: ACCOUNT_1_CHECKING_FUNDED → COUNTERPARTY_1_ACH_INDIVIDUAL
- **ACH Pull**: ACCOUNT_1_CHECKING_FUNDED ← COUNTERPARTY_1_ACH_INDIVIDUAL
- **Business ACH**: ACCOUNT_5_BUSINESS_CHECKING → COUNTERPARTY_2_ACH_BUSINESS
- **Insufficient Funds**: ACCOUNT_2_CHECKING_EMPTY → COUNTERPARTY_1 (should fail)
- **Blocked Account**: ACCOUNT_4_BLOCKED → COUNTERPARTY_1 (should fail)

#### Internal Transfer Testing:
- **Same Customer**: ACCOUNT_1 → ACCOUNT_2 (both owned by John TestUser)
- **Different Customer**: ACCOUNT_1 (John) → ACCOUNT_5 (Test Corp)
- **Different Products**: ACCOUNT_1 (Checking) → ACCOUNT_3 (Savings)

#### Wire Testing:
- **Domestic Wire**: ACCOUNT_6_WIRE → COUNTERPARTY_3_WIRE_DOMESTIC
- **International Wire**: ACCOUNT_6_WIRE → COUNTERPARTY_4_WIRE_INTERNATIONAL
- **High Value**: Test $50k+ wire from ACCOUNT_6_WIRE

#### Velocity Limit Testing:
- **Daily Limit**: Use ACCOUNT_3_SAVINGS_FUNDED (Sarah HighVolume)
  - Send $5k x 3 times in same day (if limit is $10k/day, 3rd should fail)
- **Monthly Limit**: Track cumulative transactions over test period

#### Compliance Testing:
- **OFAC Check**: Create transaction to known OFAC-flagged name
- **Blocked Counterparty**: Try transaction to COUNTERPARTY_5_BLOCKED (should fail)
- **Blocked Customer**: Verify CUSTOMER_3_BLOCKED cannot transact

#### Status Transition Testing:
- **Account Status**: Use ACCOUNT_2_CHECKING_EMPTY for status changes
  - ACTIVE → BLOCKED → ACTIVE
  - ACTIVE → INACTIVE → CLOSED
- **Cannot Close with Balance**: Try closing ACCOUNT_1 (has balance, should fail)

### Test Configuration

**Velocity Limits** (configure on TEST_PRODUCT):
```json
{
  "dailyTransactionLimit": 10000.00,
  "monthlyTransactionLimit": 50000.00,
  "dailyTransactionCount": 10,
  "singleTransactionLimit": 25000.00
}
```

**ACH Configuration**:
```json
{
  "prenoteRequired": false,
  "sameDayAchEnabled": true,
  "standardAchEnabled": true,
  "achReturnsEnabled": true
}
```

**Wire Configuration**:
```json
{
  "domesticWireEnabled": true,
  "internationalWireEnabled": true,
  "wireCutoffTime": "15:00:00",
  "dualApprovalThreshold": 10000.00
}
```

### Data Maintenance Strategy

**For integration tests, use the stable data above and:**
1. ✅ **DO**: Query existing data
2. ✅ **DO**: Create transactions (they'll be logged, can be filtered by date)
3. ✅ **DO**: Update account statuses (test transitions, then restore)
4. ❌ **DON'T**: Delete customers, accounts, counterparties
5. ❌ **DON'T**: Modify balances directly (use transactions)
6. ⚠️ **BE CAREFUL**: When creating new transactions, use unique `externalId` to avoid duplicates

**Cleanup Strategy**:
- Transactions accumulate (filter by date range, externalId pattern)
- Account balances may drift (periodic reset via manual adjustments if needed)
- Status changes should be reverted at end of test (BLOCKED → ACTIVE, etc.)

**Idempotency**:
- Use `externalId` with format: `CI_TEST_{testName}_{timestamp}_{uniqueId}`
- Example: `CI_TEST_ACH_PUSH_20260213_143022_abc123`
- Prevents duplicate transactions if test reruns

---

## 7. Key Insights for Test Planning

### Transaction Flow Patterns

1. **Account-to-Account (Internal)**:
   - Creates 2 transactions: debit from sender, credit to recipient
   - Instant settlement (POSTED immediately)
   - No counterparty needed

2. **ACH Push/Pull**:
   - Initial status: PENDING
   - Submitted to settlement file: status → SUBMITTED
   - Sent to bank: status → SENT
   - Bank confirms: status → POSTED
   - If returned: status → RETURNED, creates return transaction

3. **Wire Transfer**:
   - May start in PENDING if dual approval required
   - Once approved: sent same-day
   - Status: PENDING → SUBMITTED → SENT → POSTED
   - Higher scrutiny (OFAC, limits, manual review)

4. **Compliance Holds**:
   - OFAC hit: transaction → REJECTED_OFAC or status PENDING with alert
   - Manual review: transaction status MANUAL_REVIEW
   - Alert created with type=OFAC

### Error Scenarios to Test

1. **Insufficient Balance**:
   - Status: `REJECTED_INSUFFICENT_FUNDS`
   - HTTP 400 or 422

2. **Invalid Account Status**:
   - Status: `REJECTED_ACCOUNT_STATE`
   - Message: "Account is BLOCKED/INACTIVE/CLOSED"

3. **Invalid Customer Status**:
   - Status: `REJECTED_CUSTOMER_STATE`
   - Message: "Customer is BLOCKED/INACTIVE"

4. **Velocity Limit Exceeded**:
   - Status: `REJECTED_VELOCITY_LIMIT`
   - HTTP 422

5. **Invalid Counterparty**:
   - Status: `REJECTED_PAYMENT_INSTRUMENT`
   - Message: "Counterparty is invalid or blocked"

6. **OFAC Hit**:
   - Status: `REJECTED_OFAC` or PENDING with alert
   - Alert created, requires manual review

7. **Invalid Transaction Data**:
   - Status: `REJECTED_INVALID_TRANSACTION_DATA`
   - HTTP 400 (bad request)

### Webhook/Event Monitoring

For integration testing, subscribe to these events:
- `ACH_ORIGINATION_SUBMITTED` - ACH transaction submitted
- `ACH_ORIGINATION_SENT` - ACH sent to bank
- `ACH_OUTBOUND_POSTED` - ACH settled
- `ACH_ORIGINATION_RETURNED` - ACH returned
- `WIRE_OUTBOUND_SUBMITTED`, `WIRE_OUTBOUND_SENT`, `WIRE_OUTBOUND_POSTED`
- `ACCOUNT_TO_ACCOUNT` - Internal transfer
- `ALERT_CREATED` - Compliance alert
- `CUSTOMER_STATUS`, `COUNTERPARTY_STATUS` - Status changes

### Authentication Notes

All endpoints require authentication via JWT token (AWS Cognito).

**ApiClient behavior**:
- Auto-injects JWT token in `Authorization: Bearer {token}` header
- Refreshes token when expired
- Handles 401 Unauthorized responses

For testing:
- Use dedicated test user with appropriate roles
- Ensure user has access to test program/products
- Session management via AWS Amplify

### Pagination

List endpoints (accounts, transactions, etc.) likely support pagination:
```json
{
  "page": 0,
  "pageSize": 20,
  "totalCount": 150,
  "results": [...]
}
```

Always implement pagination in tests for robust result handling.

---

## Summary Checklist for Test Automation

✅ **Before Running Tests**:
- [ ] Test program, products, customers, accounts, counterparties exist
- [ ] Test accounts have known balances
- [ ] Test user has valid Cognito credentials
- [ ] API base URL configured correctly (test.braid.zone)
- [ ] Webhook endpoints configured (if testing events)

✅ **During Tests**:
- [ ] Use stable test data (don't create/delete entities)
- [ ] Create transactions with unique `externalId`
- [ ] Validate transaction status transitions
- [ ] Check account balances after transactions
- [ ] Test error scenarios (insufficient funds, blocked accounts, etc.)
- [ ] Verify OFAC/compliance checks trigger alerts

✅ **After Tests**:
- [ ] Verify no orphaned PENDING transactions
- [ ] Restore account statuses to original state
- [ ] Check for unexpected alerts or errors
- [ ] Validate transaction history via search endpoint
- [ ] Generate test report with transaction IDs for audit

---

## Additional Resources

- **OpenAPI Spec**: `braid-open-api-1.8.json`
- **Base URLs**:
  - Test: `https://api.test.braid.zone`
  - Dev: `https://api.dev.braid.zone`
- **Authentication**: AWS Cognito (configured in `amplifyconfiguration.json`)
- **Dashboard**: Next.js app at `src/app/`

---

**End of Analysis**
