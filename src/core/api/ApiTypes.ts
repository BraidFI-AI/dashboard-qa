export interface Alert {
  tenantId?: string | null;
  id?: number | null;
  type?: string | null;
  status?: string | null;
  description?: string | null;
  contextType?: string | null;
  contextId?: string | null;
  alertNotes?: AlertNote[] | null;
  alertTimelines?: AlertTimeline[] | null;
  alertDocuments: AlertDocument[] | null;
  assignedUsername?: string | null;
  additionalParam?: string | null;
  monitoring?: boolean | null;
}

export interface Case {
  id: number | null;
  status: string | null;
  name: string | null;
  description: string | null;
  tenantId: string | null;
  alerts: Alert[];
  caseNotes: CaseNote[];
  caseTimelines: CaseTimeline[];
  caseDocuments: CaseDocument[];
}

export interface CaseTimeline {
  id: number | null;
  action: string | null;
  actionDateTime: number | null;
  username: string | null;
  alertId: number | null;
  caseId: number | null;
}

export interface CaseNote {
  id: number | null;
  note: string | null;
  noteDateTime: number | null;
  username: string | null;
  alertId: number | null;
  caseId: number | null;
}

export interface CaseDocument {
  id: number | null;
  alertId: number | null;
  caseId: number | null;
  status: string | null;
  documentType: string | null;
  description: string | null;
  attributes: {};
  fileType: string | null;
  fileExtension: string | null;
  documentUrl: string | null;
  createdAt: number | null;
  updatedAt: number | null;
}

export interface AlertNote {
  id?: number | null;
  note?: string | null;
  noteDateTime?: number | null;
  username?: string | null;
  alertId?: number | null;
}

export interface AlertTimeline {
  id?: number | null;
  action?: string | null;
  actionDateTime?: number | null;
  username?: string | null;
  alertId?: number | null;
}

export interface AlertDocument {
  id: number | null;
  name?: string | null;
  alertId: number | null;
  caseId: number | null;
  status: string | null;
  documentType: string | null;
  description: string | null;
  attributes: {};
  fileType: string | null;
  fileExtension: string | null;
  documentUrl: string | null;
  createdAt: number | null;
  updatedAt: number | null;
}

export interface IdsListType {
  id: number | null;
  name: string | null;
}

export interface BusinessExternalAccount {
  accountNumber?: string | null;
  bankAccountType?: string | null;
  bankName?: string | null;
  routingNumber?: string | null;
}

export interface IndividualExternalAccount {
  accountNumber?: string | null;
  bankAccountType?: string | null;
  bankName?: string | null;
  routingNumber?: string | null;
}

export interface Individual {
  subType?: string | null;
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  cipStatus?: string | null;
  mobilePhone: string;
  type: string;
  tcAgreed: boolean;
  mobilePhoneVerified: boolean;
  emailVerified: boolean;
  customerVerified: boolean;
  status: string;
  idNumber: string;
  ssn: string;
  dateOfBirth?: number[];
  idType: string;
  createdAt: number;
  updatedAt: number;
  ubo: UBO;
  ofacId: number | null;
  achCompanyId: string | null;
  ach?: IndividualExternalAccount | null;
  productId?: string | null;
  addresses?: {
    id?: number | null;
    type?: string | null;
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    countryCode?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
    createdAt?: number | null;
    updatedAt?: number | null;
  }[];
}

export interface UBO {
  id: number;
  email: string;
  isControlPerson: boolean;
  ownership: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface BusinessKYC {
  id: number;
  customerId: number;
  clientUserId: string;
  verificationId: string;
  verificationTemplate: string;
  verificationUrl: string;
  verificationType: string;
  verificationStatus: string;
  startDateTime: [number, number, number, number, number, number];
  completeDateTime: string;
  verificationResult: string;
}

export interface UBODetailed {
  id: number;
  email: string;
  isControlPerson: boolean;
  ownership: string;
  title: string;
  customerId: number;
  customerFirstName: string;
  customerMiddleName: string;
  customerLastName: string;
  customerEmail: string;
  businessId: number;
  businessName: string;
  businessDba: string;
  businessEntityType: string;
  createdAt: number;
  updatedAt: number;
}

export interface BusinessAddress {
  id?: number | null;
  type?: string | null;
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  countryCode: string | null;
}

export interface CreateUBO {
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  ownership: string;
  dateOfBirth: string;
  ssn: string;
  idNumber: string;
  address: {
    city?: string | null;
    countryCode?: string | null;
    line1?: string | null;
    line2?: string | null;
    state?: string | null;
    postalCode?: string | null;
  };
}

export interface Business {
  subType?: string | null;
  address: BusinessAddress[];
  cipStatus?: string | null;
  id: number;
  name: string;
  email: string;
  mobilePhone: string;
  productId: number | null;
  type: string;
  mcc?: string | null;
  naics?: string | null;
  tcAgreed: boolean;
  mobilePhoneVerified: boolean;
  emailVerified: boolean;
  customerVerified: boolean;
  status: string;
  taxId: string;
  businessIdType: string;
  idNumber: string;
  dba: string;
  businessEntityType?: string;
  formationDate: number;
  incorporationState: string;
  website: string;
  ubos: UBO[];
  createdAt: number;
  updatedAt: number;
  ofacId: number | null;
  submittedBy: {
    contactPersonFirstName: string;
    contactPersonLastName: string;
    contactPersonEmail: string;
    contactPersonPhone: string;
  };
  ach: {
    accountNumber?: string | null;
    bankAccountType?: string | null;
    bankName?: string | null;
    routingNumber?: string | null;
  };
  achCompanyId: string | null;
}

export interface CustomerAccount {
  id: string;
  balance: {
    accountBalance: string;
    availableBalance: string;
  };
  accountName?: string | null;
  currency: string;
  frozen?: boolean;
  active?: boolean;
  customerId: string;
  accountCode: string;
  accountNumber: string;
  accountingCurrency: string;
  xpub: any;
}

export interface BusinessDocument {
  id: number;
  customerId: number;
  status: string;
  documentType: string;
  description: string;
  name: string;
  attributes: any; //
  reasonCode: string | null;
  reason: string | null;
  fileType: string;
  fileExtension: string;
  createdAt: number;
  documentUrl: string | null;
  updatedAt: number;
}

export interface CreateIndividualDocument {
  name: string;
  description: string;
  documentType: string;
  attributes: {};
}

export interface CreateBusinessDocument {
  name: string;
  description: string;
  documentType: string;
  attributes: {};
}

export interface BusinessDocumentWithLink {
  document: BusinessDocument;
  link: string;
}

export interface IndividualDocumentWithLink {
  document: IndividualDocument;
  link: string;
}

export interface IndividualDocument {
  id: number;
  customerId: number;
  status: string;
  documentType: string;
  description: string;
  name: string;
  attributes: any; //
  reasonCode: string | null;
  reason: string | null;
  fileType: string;
  fileExtension: string;
  documentUrl: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface Account {
  id?: number | null;
  accountNumber?: string | null;
  accountName?: string | null;
  productId?: number | null;
  customerId?: number | null;
  cardManagementId?: number | null;
  virtualAccountId?: string | null;
  status?: string | null;
  createdAt?: number | null;
  updatedAt?: number | null;
  canAcceptSweep?: string | null;
  fundingAccountNumber?: string | null;
  sweepAccountNumber?: string | null;
}

export interface AccountCard {
  accountId?: number;
  bin?: string;
  cardManagementId?: number;
  createdAt: number | null;
  embossingName?: string;
  expiration?: string;
  id?: number;
  lastFour?: string;
  updatedAt: number | null;
  virtual?: boolean;
  pinEnabled?: boolean;
  maskedPan?: string;
  status?: string;
}

export interface Program {
  id: number;
  name?: string;
  type?: string;
  isActive?: boolean;
  nachaIssuerId: string;
  createdAt: number;
  updatedAt: number;
  customerId: number;
  baseUrl: string;
  achOdfi?: string | null;
  operatingModel?: string | null;
}

export interface Product {
  id?: number;
  productId?: string | null;
  productName?: string | null;
  isActive?: boolean | null;
  prefix?: string | null;
  suffix?: string | null;
  length?: number | null;
  currency?: string | null;
  accountingCurrency?: string | null;
  programId?: number | null;
  interestRate?: number | null;
  interestPayDayOfMonth?: number | null;
  duplicatePaymentCheckDays?: number | null;
  cipConfig?: string | null;
  type?: string | null;
  customerAccountType?: string | null;
  defaultCardManagementId?: number | null;
  onboardingConfig?: OnboardingConfig | null;
  tenantId?: string | null;
  productSettlementEmails?: { settlementEmail: string }[] | null;
  duplicatePaymentDays?: number | null;
  createdAt?: number | null;
  updatedAt?: number | null;
  operatingModel?: string | null;
}

export interface CreateProduct {
  customerAccountType: string;
  isActive: string;
  length: number;
  prefix: string;
  productId: string;
  productName: string;
  programId: string;
  productSettlementEmails?: { settlementEmail: string }[] | null;
  suffix: string;
  tenantId: string;
  operatingModel?: string;
}

export interface ProductTransactionVolume {
  tenant_id: string;
  value: number;
  label: string;
  product_id: number;
  created_at: number;
}

export interface ACHConfig {
  calendar?: {
    fridayActive?: boolean;
    holidays?: ACHConfigCalendarHoliday[];
    mondayActive?: boolean;
    saturdayActive?: boolean;
    sundayActive?: boolean;
    thursdayActive?: boolean;
    tuesdayActive?: boolean;
    wednesdayActive?: boolean;
  };
  immediateDestination?: string;
  immediateDestinationName?: string;
  immediateOrigin?: string;
  immediateOriginName?: string;
  leadDays?: number;
  odfi?: string;
  offsetAccountName?: string;
  offsetAccountNumber?: string;
  offsetAccountType?: string;
  offsetIdentificationNumber?: string;
  offsetRoutingNumber?: string;
  offsetType?: string;
  quickExtract?: boolean;
  serviceType?: string;
  timezone?: string;
  windows?: ACHConfigWindow[];
}

export interface WireTransactionStatus {
  totalRecords?: number | null;
  errorCount?: number | null;
  rejectCount?: number | null;
  pendingCount?: number | null;
  postedCount?: number | null;
  createdAt?: number | null;
  errors: {
    level?: string | null;
    message?: string | null;
  }[];
}

export interface ACHTransactionStatus {
  fileName?: string | null;
  processingDate: "2024-07-17";
  errorTransactions?: number | null;
  pendingTransactions?: number | null;
  offsetTransactions?: number | null;
  postedTransactions?: number | null;
  rejectedTransactions?: number | null;
  manualReviewTransactions?: number | null;
  duplicateTransactions?: number | null;
  totalTransactions?: number | null;
}

export interface ACHFileError {
  id?: number | null;
  createdAt?: number | null;
  reference?: string | null;
  paymentId?: number | null;
  linkedPaymentId?: string | null;
  productId?: number | null;
  accountId?: number | null;
  customerId?: number | null;
  achId?: number | null;
  summary?: string | null;
  filename?: string | null;
  externalId?: string | null;
  details?: string | null;
}

export interface ACHConfigCalendarHoliday {
  day: number;
  month: number;
  name: string;
  year: number;
}

export interface ACHConfigWindow {
  allowSameDay: boolean;
  hours: number;
  minutes: number;
}

export interface ACHConfigWithStringDate {
  calendar?: {
    fridayActive?: boolean;
    holidays?: ACHConfigCalendarHoliday[];
    mondayActive?: boolean;
    saturdayActive?: boolean;
    sundayActive?: boolean;
    thursdayActive?: boolean;
    tuesdayActive?: boolean;
    wednesdayActive?: boolean;
  };
  immediateDestination?: string;
  immediateDestinationName?: string;
  immediateOrigin?: string;
  immediateOriginName?: string;
  leadDays?: number;
  odfi?: string;
  offsetAccountName?: string;
  offsetAccountNumber?: string;
  offsetAccountType?: string;
  offsetIdentificationNumber?: string;
  offsetRoutingNumber?: string;
  offsetType?: string;
  quickExtract?: boolean;
  serviceType?: string;
  timezone?: string;
  windows?: ACHConfigWindowWithStringTime[];
}

export interface ACHConfigCalendarHolidayWithStringDate {
  name: string;
  date: string;
}

export interface ACHConfigWindowWithStringTime {
  allowSameDay: boolean;
  time?: string;
  hours?: string | null;
  minutes?: string | null;
}

export interface FundsAvailability {
  id: number;
  productId: number;
  achHoldDays: number;
  checkDepositHoldDays: number;
  createdAt: number;
  updatedAt: number;
}

export interface UpdateFundsAvailability {
  achHoldDays: number;
  checkDepositHoldDays: number;
}

export interface OnboardingConfig {
  onboardingUrl: string | null;
  buttonColor: string | null;
  pdfTemplateUrl: string | null;
  logoUrl: string | null;
  feeScheduleURL: string | null;
  feeScheduleVersion: number | null;
}

export interface Card {
  id: number;
  productId: number;
  name: string;
  active: boolean;
  cardNumberLength: number;
  randomCardNumber: boolean;
  defaultForProduct: boolean;
  allowCards: boolean;
  anonymous: boolean;
  bin: string;
  allowAtm: boolean;
  allowEcommerce: boolean;
  allowMoto: boolean;
  allowPos: boolean;
  allowTips: boolean;
  smart: boolean;
  startDate: [number, number, number];
  endDate: [number, number, number];
  createdAt: number;
  updatedAt: number;
}

export interface CustomizableForm {
  questionSetId: number;
  name: string;
  programId: number;
  productId: number;
  version: number;
  createdAt: number;
  updatedAt: number;
  questions: CustomizableFormQuestion[];
}

export interface CustomizableFormQuestion {
  id: number;
  questionSetId: number;
  questionName: string;
  questionText: string;
  displayPosition: number;
  answerType: string;
  answerValues: string[] | null;
  required: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ACHSettlementHistory {
  filename: string;
  extracted: string;
  instructionCount: number;
  file: null;
  productId: string | null;
  status?: string | null;
  sftpStatus?: string | null;
}

export interface WireReturnFile {
  filename?: string | null;
  status?: string | null;
  createdAt?: number | null;
  updatedAt?: number | null;
  transactionCount?: number | null;
  transactionAmount?: number | null;
}

export interface WireSettlementHistory {
  filename?: string | null;
  productId?: number | null;
  status?: string | null;
  createdAt?: number | null;
  updatedAt?: number | null;
  transactionCount?: number | null;
}

export interface Submission {
  submissionId: number;
  questionSetId: number;
  questionSetVersion: number;
  questionSetName: string;
  answers: SubmissionAnswer[];
  createdAt: number;
  updatedAt: number;
}

export interface SubmissionAnswer {
  question: SubmissionAnswerQuestion;
  answer: SubmissionAnswerAnswer;
}

export interface SubmissionAnswerQuestion {
  id: number;
  questionSetId: number;
  questionName: string;
  questionText: string;
  displayPosition: number;
  answerType: string;
  answerValues: string[];
  required: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface SubmissionAnswerAnswer {
  id: number;
  questionId: number;
  submissionId: number;
  answer: string[];
  customerId: number;
  createdAt: number;
  updatedAt: number;
}

export interface Transaction {
  ach?: any | null;
  wire?: any | null;
  customUUID: string;
  customerId?: number | null;
  customerType?: string | null;
  customerName: string | null;
  accountId: string;
  accountNumber: string;
  counterAccountId: string | null;
  currency: string;
  amount: string;
  anonymous: string | null;
  created: number;
  marketValue: TransactionMarketValue;
  operationType: string | null;
  transactionType: string;
  counterpartyId?: string | null;
  counterpartyName?: string | null;
  counterpartyAssociatedEntityId?: string | null;
  counterpartyAssociatedEntityType?: string | null;
  reference: string;
  transactionCode: string | null;
  senderNote: string;
  recipientNote: string;
  paymentId: string | null;
  attr: string | null;
  address: string | null;
  txId: string;
  location: string;
  feeAmount: string | null;
}

export interface TransactionMarketValue {
  amount: string;
  currency: string;
  sourceDate: number;
  source: string | null;
}

export interface AlertSearch {
  contextType?: string;
  contextId?: string;
  types?: string[];
  statuses?: string[];
  alertId?: string;
  rfiStatus?: string;
  assignee?: string;
  startDate?: string;
  endDate?: string;
}

export interface OFACSearch {
  status?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
}

export interface CustomerSearch {
  name?: string;
  productName?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  status?: string;
}

export interface WireFireRecord {
  id?: number | null;
  fileId?: number | null;
  lineNumber?: number | null;
  text?: string | null;
  importStatus?: string | null;
  finalId?: string | null;
  errors: {
    level?: string | null;
    message?: string | null;
  }[];
  tag1510?: string | null;
  tag1520?: string | null;
  tag2000?: string | null;
  tag3100?: string | null;
  tag3400?: string | null;
  tag4100?: string | null;
  tag4200?: string | null;
  fileHandle?: string | null;
}

export interface Statement {
  id?: string;
  productId?: string | null;
  programId?: string | null;
  accountName?: string;
  starting?: string;
  ending?: string;
  startingBalance?: number | null;
  endingBalance?: number | null;
  transactionSummary: {
    count?: number | null;
    type?: string | null;
    amount?: number | null;
    polarity?: string | null;
  }[];
}

export interface TransactionSearch {
  originalFileName?: string;
  requesterIpAddress?: string;
  requesterUsername?: string;
  showAchNoc?: boolean;
  excludeWire?: boolean;
  excludeAch?: boolean;
  wireFileHandle?: string;
  direction?: string;
  counterpartyId?: string;
  customerId?: string;
  settlementFileName?: string;
  isInbound?: boolean;
  accountNumber?: string;
  processingStatus?: string[];
  beginDate?: string;
  endDate?: string;
  postDateStart?: string;
  postDateEnd?: string;
  maxAmount?: string;
  minAmount?: string;
  productId?: string;
  paymentId?: string;
  transactionStatus?: string[];
  transactionType?: string[];
}
export interface CreateProgram {
  name: string;
  isActive: boolean;
  type: string;
  achOdfi: string;
  operatingModel?: string | null;
}

export interface CreateDepositTokenProduct {
  productId: string;
  basePair?: string;
  blockchain?: string;
  cap?: number;
  customerAccountType: string;
  environment: string;
  isActive: true;
  length: number;
  prefix: string;
  productName: string;
  programId: number;
  suffix: string;
  symbol?: string;
}

export interface CreateStableCoinProduct {
  productId: string;
  basePair?: string;
  blockchain?: string;
  cap?: number;
  customerAccountType: string;
  environment: string;
  isActive: true;
  length: number;
  prefix: string;
  productName: string;
  programId: number;
  suffix: string;
  symbol?: string;
}

export interface CreateVirtualFiatProduct {
  productId: string;
  tenantId: string;
  currency?: string;
  customerAccountType: string;
  environment: string;
  isActive: boolean;
  ledgerConfig?: string;
  length: number;
  prefix: string;
  productName: string;
  programId: number;
  suffix: string;
}

export interface UpdateProduct {
  isActive: boolean;
  productSettlementEmails?: { settlementEmail: string }[] | null;
  productName: string;
  cipConfig?: string | null;
}

export interface CreateForm {
  name: string;
  productId: string;
  programId: string;
}

export interface Counterparty {
  id?: number | null;
  name?: string | null;
  type?: string | null;
  email?: string | null;
  phone?: string | null;
  createDate?: number | null;
  createdBy?: string | null;
  updateDate?: number | null;
  updatedBy?: string | null;
  createdAt?: number | null;
  updatedAt?: number | null;
  individualId?: number | null;
  businessId?: number | null;
  productId?: number | null;
  accountId?: number | null;
  accountNumber?: string | null;
  status?: string | null;
  blockedResults: CounterpartyBlockedResults[];
  ach: CounterpartyACH | null;
  wire: CounterpartyWire | null;
  braid: CounterpartyBraid | null;
  ofacId?: number | null;
  idNumber?: string | null;
  idType?: string | null;
  dateOfBirth?: number[] | null;
}

export interface CounterpartyBlockedResults {
  key: string | null;
  value: string | null;
  results: {
    SDNs: [
      {
        entityID: string | null;
        sdnName: string | null;
        sdnType: string | null;
        program: string[];
        title: string | null;
        callSign: string | null;
        vesselType: string | null;
        tonnage: string | null;
        grossRegisteredTonnage: string | null;
        vesselFlag: string | null;
        vesselOwner: string | null;
        remarks: string | null;
        match: number;
      }
    ];
    altNames: [];
    addresses: string | null;
    deniedPersons: [];
    bisEntities: [];
    militaryEndUsers: string | null;
    sectoralSanctions: [];
    unverifiedCSL: string | null;
    nonproliferationSanctions: string | null;
    foreignSanctionsEvaders: string | null;
    palestinianLegislativeCouncil: string | null;
    captaList: string | null;
    itarDebarred: string | null;
    nonSDNChineseMilitaryIndustrialComplex: string | null;
    nonSDNMenuBasedSanctionsList: string | null;
    euConsolidatedSanctionsList: [];
    ukConsolidatedSanctionsList: [];
    ukSanctionsList: string | null;
    refreshedAt: string | null;
  };
}

export interface CounterpartyBraid {
  id: number | null;
  custId: number | null;
  contactId: number | null;
  accountNumber: string | null;
  instrumentType: string | null;
  status: string | null;
  blockedResults: null | null;
  createdAt: number | null;
  updatedAt: number | null;
}
export interface CounterpartyACH {
  id: number | null;
  custId: number | null;
  countryCode?: string | null;
  receiverCity: string | null;
  receiverPostalCode: string | null;
  receiverState: string | null;
  receiverStreetAddress: string | null;
  contactId: number | null;
  routingNumber: string | null;
  accountNumber: string | null;
  bankName: string | null;
  bankAccountType: string | null;
  type: string | null;
  instrumentType: string | null;
  status: string | null;
  blockedResults: CounterpartyBlockedResults[] | null;
  gatewayRoutingNumber: string | null;
  rdfiNumberQualifier: string | null;
  createdAt: number | null;
  updatedAt: number | null;
}

export interface CounterpartyWire {
  id: number | null;
  custId: number | null;
  contactId: number | null;
  name: string | null;
  address?: {
    type?: string | null;
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    countryCode?: string | null;
  };
  beneficiaryAccountNumber?: string | null;
  beneficiaryFIAddress?: {
    type?: string | null;
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    countryCode?: string | null;
  };
  beneficiaryFIIdType?: string | null;
  beneficiaryFIName?: string | null;
  beneficiaryIdNumber?: string | null;
  intermediaryFIAddress?: {
    type?: string | null;
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    countryCode?: string | null;
  };
  originatorAccountNumber?: string | null;
  originatorFiName?: string | null;
  originatorFiIdType?: string | null;
  originatorFiIdNumber?: string | null;
  originatorFiAddress?: {
    type?: string | null;
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    countryCode?: string | null;
  };
  intermediaryFIIdNumber?: string | null;
  intermediaryFIIdType?: string | null;
  intermediaryFIName?: string | null;
  receiverRoutingNumber?: string | null;
  receiverShortName?: string | null;
  type?: string | null;
  instrumentType: string | null;
  status: string | null;
  phone: string | null;
  email: string | null;
  blockedResults: null | null;
  createdAt: number | null;
  updatedAt: number | null;
}

export interface CreateCounterparty {
  email: string | null;
  name: string | null;
  phone: string | null;
  Email: string;
  Phone: string;
  type: string;
  accountNumber?: string;
  ach: CreateCounterpartyACH | null;
  braid: CreateCounterpartyBraid | null;
  businessId?: number;
  businessName: string;
  firstName: string;
  individualId?: number;
  lastName: string;
  productId?: number;
  wire: CreateCounterPartyWire | null;
}

export interface CreateCounterPartyWire {
  address?: {
    city?: string | null;
    countryCode?: string | null;
    line1?: string | null;
    line2?: string | null;
    postalCode?: string | null;
    state?: string | null;
    type?: string | null;
  };
  beneficiaryAccountNumber?: string | null;
  beneficiaryFIAddress?: {
    city?: string | null;
    countryCode?: string | null;
    line1?: string | null;
    line2?: string | null;
    postalCode?: string | null;
    state?: string | null;
    type?: string | null;
  };
  beneficiaryFIIdType?: string | null;
  beneficiaryFIName?: string | null;
  beneficiaryIdNumber?: string | null;
  intermediaryFIAddress?: {
    city?: string | null;
    countryCode?: string | null;
    line1?: string | null;
    line2?: string | null;
    postalCode?: string | null;
    state?: string | null;
    type?: string | null;
  };
  intermediaryFIIdNumber?: string | null;
  intermediaryFIIdType?: string | null;
  intermediaryFIName?: string | null;
  receiverRoutingNumber?: string | null;
  receiverShortName?: string | null;
  type?: string | null;
}

export interface CreateCounterpartyBraid {
  accountNumber: string;
}

export interface CreateCounterpartyACH {
  accountNumber: string;
  bankName: string;
  bankAccountType: string;
  routingNumber: string;
  gatewayRoutingNumber: string | null;
  rdfiNumberQualifier: string | null;
  address: {
    city: string | null;
    countryCode: string | null;
    line1: string | null;
    line2: string | null;
    postalCode: string | null;
    state: string | null;
    type: string | null;
  };
}

export interface SearchCounterparty {
  accountId?: string | null;
  businessId?: string | null;
  individualId?: string | null;
  productId?: string | null;
  name?: string | null;
}

export interface Developer {
  tenantId: string | null;
  name: string | null;
  enableIpRestriction?: string | null;
}

export interface WhitelistedIP {
  id?: number;
  ipAddress?: string | null;
  tenant?: {
    tenantId?: string | null;
    name?: string | null;
    enableIpRestriction?: string | null;
  };
}

export interface CreateDeveloper {
  tenantId: string;
  name: string;
}

export interface CreateLimit {
  accountNumber: string | null;
  amount: number | null;
  counterpartyId: number | null;
  durationDays: number | null;
  frequencyMax: number | null;
  limitName: string | null;
  limitType: string | null;
  productId: number | null;
  programId: number | null;
  transactionType: string | null;
  action: string | null;
}

export interface RulesAndLimits {
  id: number | null;
  limitName: string | null;
  limitType: string | null;
  productId: number | null;
  programId: number | null;
  accountNumber: string | null;
  counterpartyId: number | null;
  durationDays: number | null;
  amount: number | null;
  transactionType: string | null;
  createdAt: number | null;
  updatedAt: number | null;
  status: string | null;
  frequencyMax: number | null;
  action: string | null;
}
export interface CreateAcount {
  cardManagementId: Number | null;
  custId: Number | null;
  productId: Number | null;
}

export interface Compliance314ALog {
  id?: number | null;
  requesterIpAddress?: string | null;
  requesterUsername?: string | null;
  filename?: string | null;
  fileUploadedAt?: number | null;
  numberOfRecordsUploaded?: number | null;
  numberOfBusinessesScanned?: number | null;
  numberOfIndividualsScanned?: number | null;
  numberOfAlertsCreated?: number | null;
}

export interface Compliance314A {
  list314aId?: string | null;
  counterpartyName?: string | null;
  counterpartyId?: string | null;
  businessName?: string | null;
  businessId?: string | null;
  individualName?: string | null;
  individualId?: string | null;
  uboId?: string | null;
  transactionPaymentId?: string | null;
  alertId?: string | null;
  note?: string | null;
  status?: string | null;
  createdAt?: number | null;
  updatedAt?: number | null;
  updatedBy?: string | null;
  rawResults?: string | null;
}

export interface OFAC {
  ofacId: string | null;
  counterpartyId: string | null;
  note: string | null;
  uboId: string | null;
  counterpartyName: string | null;
  businessId: string | null;
  businessName: string | null;
  individualId: string | null;
  status: string | null;
  individualName: string | null;
  key: string | null;
  alertId?: string | null;
  value: string | null;
  createdAt?: number | null;
  updatedAt: number | null;
  updatedBy: string | null;
  transactionPaymentId?: string | null;
  results: {
    altNames: null;
    sdns: [
      {
        entityID: "23730";
        sdnName: "AN SAN 1";
        sdnType: "vessel";
        program: ["DPRK4"];
        title: "";
        callSign: "";
        vesselType: "";
        tonnage: "";
        grossRegisteredTonnage: "";
        vesselFlag: "Democratic People's Republic of Korea";
        vesselOwner: "";
        remarks: "Secondary sanctions risk: North Korea Sanctions Regulations, sections 510.201 and 510.210; Transactions Prohibited For Persons Owned or Controlled By U.S. Financial Institutions: North Korea Sanctions Regulations section 510.214; Vessel Registration Identification IMO 7303803; Linked To: KOREA ANSAN SHIPPING COMPANY.";
        match: 1;
        altNames: [];
        addresses: null;
        deniedPersons: [];
        bisEntities: [];
        militaryEndUsers: null;
        sectoralSanctions: [];
        unverifiedCSL: null;
        nonproliferationSanctions: null;
        foreignSanctionsEvaders: null;
        palestinianLegislativeCouncil: null;
        captaList: null;
        itarDebarred: null;
        nonSDNChineseMilitaryIndustrialComplex: null;
        nonSDNMenuBasedSanctionsList: null;
        euConsolidatedSanctionsList: [];
        ukConsolidatedSanctionsList: [];
        ukSanctionsList: null;
        refreshedAt: "2023-10-29T18:05:01.474819666Z";
      }
    ];
  };
  rawResults: string;
}

export interface CreateUser {
  username: string;
  email: string;
  // password: string;
  tenantId: string;
  group: string;
}

export interface User {
  Attributes?: UserAttribute[] | null;
  Enabled?: boolean | null;
  UserCreateDate?: string | null;
  UserLastModifiedDate?: string | null;
  UserStatus?: string | null;
  Username?: string | null;
}

export interface UserResponse {
  users: User[];
  _metadata: {
    pagination: {
      next: string;
    };
  };
}

export interface UserAttribute {
  Name?: string | null;
  Value?: string | null;
}

export interface FeeSearch {
  accountNumber?: string;
  productId?: string;
  programId?: string;
  type?: "ACCOUNT" | "PRODUCT" | "PROGRAM" | "GLOBAL";
  transactionTypes?: string[];
  transactionGroups?: string[];
}
export interface Fees {
  id?: string | null;
  amount?: string | null;
  dayOfMonth?: string | null;
  feeType?: "FLAT" | "PERCENT" | "MONTHLY";
  settlementAccountNumber?: string | null;
  feeChargingAccountNumber?: string | null;
  sameDay?: boolean | null;
  associatedEntityType?: "ACCOUNT" | "PRODUCT" | "PROGRAM" | "GLOBAL";
  associatedEntityId?: string;
  transactionTypes?: string[];
  transactionGroups?: string[];
  feeTieredDetails?: TieredFee[];
  createdAt?: number | null;
  updatedAt?: number | null;
}

export interface CreateFee {
  amount: string;
  dayOfMonth?: string | null;
  type: "FLAT" | "PERCENT" | "MONTHLY";
  settlementAccountNumber: string;
  feeChargingAccountNumber?: string | null;
  sameDay?: boolean | null;
  associatedEntityType: "ACCOUNT" | "PRODUCT" | "PROGRAM" | "GLOBAL";
  associatedEntityId?: string;
  transactionTypes?: string[];
  transactionGroups?: string[];
  tieredFeeDetails?: TieredFee[];
}

export interface TieredFee {
  startCount: number;
  endCount?: number | null;
  amount: number;
}

export interface OneTimeFees {
  accountNumber: string;
  amount: number;
  description: string;
  settlementAccountNumber: string;
  subType: string;
}

export interface ApiKey {
  apiKey: string;
}

export interface ACH {
  id?: string | null;
  inbound?: boolean | null;
  accountId?: number | null;
  productId?: number | null;
  customerId?: number | null;
  customerType?: string | null;
  customerName?: string | null;
  addenda?: string[] | null;
  amount?: number | null;
  paymentInstrumentId?: number | null;
  paymentId?: string | null;
  counterpartyId?: number | null;
  counterpartyAssociatedEntityType?: string | null;
  counterpartyAssociatedEntityId?: number | null;
  counterpartyName?: string | null;
  createdAt?: number | null;
  description?: string | null;
  direction?: string | null;
  effective_date?: number[] | null;
  returnCode?: string | null;
  returnReason?: string | null;
  changeCode?: string | null;
  changeReason?: string | null;
  correctedData?: string | null;
  correctedInFile?: string | null;
  secCode?: string | null;
  service?: string | null;
  scheduledSettlement?: number | null;
  status?: string | null;
  updatedAt?: number | null;
  traceNumber?: string | null;
  linkedAchId?: string | null;
  initiatedAt?: number | null;
  cancelledAt?: string | null;
  manualReviewedAt?: string | null;
  erroredAt?: string | null;
  sentAt?: number | null;
  returnedAt?: string | null;
  dishoneredAt?: string | null;
  contestedAt?: string | null;
  nocReceivedAt?: string | null;
  settlementFileName?: string | null;
  submittedAt?: number | null;
  externalId?: string | null;
  accountNumber?: string | null;
  odfi?: string | null;
  originatorName?: string | null;
  originatorId?: string | null;
  rdfi?: string | null;
  receiverName?: string | null;
  receiverId?: string | null;
  receivingAccount?: string | null;
  accountType?: string | null;
  duplicateOfPaymentId?: string | null;
  ofacId?: string | null;
  iatAddenda?: string | null;
}

export interface AchCustomer {
  id: number;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  email: string | null;
  mobilePhone: string | null;
  idNumber: string | null;
  type: string | null;
  mobilePhoneVerified: boolean | null;
  emailVerified: boolean | null;
  customerVerified: number | null;
  customerToken: null;
  externalId: null;
  cipStatus: string | null;
  status: string | null;
  tcAgreed: false;
  verificationId: null;
  verificationUrl: null;
  verificationResult: null;
  verificationStatus: string | null;
  verificationReviewCode: null;
  verificationStartDate: null;
  verificationStartedBy: null;
  verificationLastActionDate: null;
  verificationLastActionBy: null;
  createdAt: number | null;
  updatedAt: number | null;
  ofacId: number | null;
  businessName: string | null;
  businessIdType: string | null;
  dba: string | null;
  businessEntityType: string | null;
  formationDate: number | null;
  incorporationState: string | null;
  website: string | null;
  submittedBy: {
    contactPersonFirstName: string | null;
    contactPersonLastName: string | null;
    contactPersonEmail: string | null;
    contactPersonPhone: string | null;
  };
  ubos: [];
  onboardingApplicationCompleted: null;
  verificationData: {
    id: null;
    custId: number | null;
    status: string | null;
    result: null;
    reviewCode: null;
    startDate: null;
    startedBy: null;
    lastActionDate: null;
    lastActionBy: null;
  };
}

export interface AchCounterparty {
  id: number;
  businessName: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  customerId: number | null;
  individualId: null;
  businessId: number | null;
  productId: null;
  accountId: null;
  status: string | null;
  type: null;
  ofacId: null;
  blockedResults: null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: number | null;
  updatedAt: number | null;
}

export interface ReturnRate {
  id: string;
  name: string | null;
  customerId: number | null;
  productId: number | null;
  adminSum: number | null;
  adminCount: number | null;
  adminReturnRate: number | null;
  unauthSum: number | null;
  unauthCount: number | null;
  unauthReturnRate: number | null;
  totalSum: number | null;
  totalCount: number | null;
  totalReturnRate: number | null;
  otherSum: number | null;
  otherCount: number | null;
}

export interface WireInbound {
  amount?: number | null;
  beneficiaryAccountNumber?: string | null;
  imad?: string | null;
  omad?: string | null;
  originatorAccountNumber?: string | null;
  originatorBankName?: string | null;
  originatorRoutingNumber?: string | null;
  originatorToBeneficiaryInfo?: string | null;
}

export interface VelocityLimit {
  id?: string | null;
  limitName?: string | null;
  limitType?: string | null;
  status?: string | null;
  aggregationDays?: string | null;
  aggregationLevel?: string | null;
  frequencyMax?: string | null;
  volume?: number | null;
  action?: string | null;
  transactionTypes?: string[] | null;
  transactionGroups?: string[] | null;
  restrictedEntities?: string[] | null;
  programId?: number | null;
  createdAt?: number | null;
  updatedAt?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export interface VelocityLimitFilters {
  accountNumber?: string;
  counterpartyId?: string;
  productId?: string;
  programId?: string;
  limitName?: string;
  limitType?: string;
  status?: string;
  aggregationLevel?: string;
  action?: string;
  transactionType?: string;
  transactionGroup?: string;
}

export interface ReconAudit {
  filename: "csv7201524062450840527.csv";
  type: "FED_WIRE_CONFIRMATION_CSV";
  status: "PROCESSED";
  requesterUsername: "testadminadmin";
  totalRecords: 0;
  matchedRecords: 0;
  exceptionRecords: 0;
  skippedRecords: 0;
  invalidRecords: 0;
  uploadedAt: 1746326250.181582;
}
