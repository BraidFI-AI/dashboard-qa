/**
 * Real Banking Data for Test Transactions
 * 
 * Contains actual routing numbers and SWIFT codes from real financial institutions.
 * Used to ensure test transactions use valid banking identifiers.
 * 
 * Source: Federal Reserve E-Payments Routing Directory & SWIFT BIC Database
 */

/**
 * Real ACH Routing Numbers
 * Format: 9-digit ABA routing transit number
 */
export const REAL_ACH_ROUTING_NUMBERS = [
  { name: 'Wells Fargo Bank', routing: '121000248', location: 'San Francisco, CA' },
  { name: 'Bank of America', routing: '026009593', location: 'Charlotte, NC' },
  { name: 'Chase Bank', routing: '021000021', location: 'New York, NY' },
  { name: 'Citibank', routing: '021000089', location: 'New York, NY' },
  { name: 'US Bank', routing: '091000022', location: 'Minneapolis, MN' },
  { name: 'PNC Bank', routing: '031000053', location: 'Pittsburgh, PA' },
  { name: 'Capital One', routing: '051405515', location: 'McLean, VA' },
  { name: 'TD Bank', routing: '031201360', location: 'Cherry Hill, NJ' },
  { name: 'BB&T (Truist)', routing: '053000219', location: 'Winston-Salem, NC' },
  { name: 'SunTrust (Truist)', routing: '061000104', location: 'Atlanta, GA' }
];

/**
 * Real Domestic Wire Routing Numbers with SWIFT Codes
 * Format: 9-digit routing + 8 or 11 character SWIFT/BIC code
 */
export const REAL_WIRE_ROUTING_NUMBERS = [
  { 
    name: 'Chase Bank', 
    routing: '021000021', 
    swift: 'CHASUS33',
    location: 'New York, NY'
  },
  { 
    name: 'Bank of America', 
    routing: '026009593', 
    swift: 'BOFAUS3N',
    location: 'Charlotte, NC'
  },
  { 
    name: 'Wells Fargo Bank', 
    routing: '121000248', 
    swift: 'WFBIUS6S',
    location: 'San Francisco, CA'
  },
  { 
    name: 'Citibank', 
    routing: '021000089', 
    swift: 'CITIUS33',
    location: 'New York, NY'
  },
  { 
    name: 'US Bank', 
    routing: '091000022', 
    swift: 'USBKUS44',
    location: 'Minneapolis, MN'
  }
];

/**
 * International Banks with SWIFT Codes
 * Format: 8 or 11 character SWIFT/BIC code + IBAN format
 */
export const INTERNATIONAL_BANKS = [
  {
    name: 'Deutsche Bank',
    swift: 'DEUTDEFF',
    country: 'Germany',
    countryCode: 'DE',
    ibanFormat: 'DE89370400440532013000'
  },
  {
    name: 'HSBC UK',
    swift: 'HSBCGB2L',
    country: 'United Kingdom',
    countryCode: 'GB',
    ibanFormat: 'GB29NWBK60161331926819'
  },
  {
    name: 'BNP Paribas',
    swift: 'BNPAFRPP',
    country: 'France',
    countryCode: 'FR',
    ibanFormat: 'FR1420041010050500013M02606'
  },
  {
    name: 'Royal Bank of Canada',
    swift: 'ROYCCAT2',
    country: 'Canada',
    countryCode: 'CA',
    ibanFormat: null // Canada doesn't use IBAN
  },
  {
    name: 'Banco Santander',
    swift: 'BSCHESMM',
    country: 'Spain',
    countryCode: 'ES',
    ibanFormat: 'ES9121000418450200051332'
  },
  {
    name: 'ING Bank',
    swift: 'INGBNL2A',
    country: 'Netherlands',
    countryCode: 'NL',
    ibanFormat: 'NL91ABNA0417164300'
  },
  {
    name: 'UniCredit Bank',
    swift: 'UNCRITM1',
    country: 'Italy',
    countryCode: 'IT',
    ibanFormat: 'IT60X0542811101000000123456'
  },
  {
    name: 'Credit Suisse',
    swift: 'CRESCHZZ80A',
    country: 'Switzerland',
    countryCode: 'CH',
    ibanFormat: 'CH9300762011623852957'
  },
  {
    name: 'Mizuho Bank',
    swift: 'MHCBJPJT',
    country: 'Japan',
    countryCode: 'JP',
    ibanFormat: null // Japan doesn't use IBAN
  }
];

/**
 * Get random ACH routing number
 */
export function getRandomACHRouting() {
  return REAL_ACH_ROUTING_NUMBERS[Math.floor(Math.random() * REAL_ACH_ROUTING_NUMBERS.length)];
}

/**
 * Get random Wire routing with SWIFT
 */
export function getRandomWireRouting() {
  return REAL_WIRE_ROUTING_NUMBERS[Math.floor(Math.random() * REAL_WIRE_ROUTING_NUMBERS.length)];
}

/**
 * Get random international bank
 */
export function getRandomInternationalBank() {
  return INTERNATIONAL_BANKS[Math.floor(Math.random() * INTERNATIONAL_BANKS.length)];
}

/**
 * Validate routing number format (9 digits)
 */
export function validateRoutingNumber(routing: string): boolean {
  return /^\d{9}$/.test(routing);
}

/**
 * Validate SWIFT code format (8 or 11 characters)
 */
export function validateSWIFTCode(swift: string): boolean {
  return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(swift);
}

/**
 * Validate IBAN format (basic check)
 */
export function validateIBAN(iban: string): boolean {
  return /^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban) && iban.length >= 15 && iban.length <= 34;
}
