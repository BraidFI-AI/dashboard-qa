/**
 * Test Data Generators using Faker.js
 * 
 * Generates realistic test data for:
 * - Individual customers
 * - Business customers
 * - ACH counterparties
 * - Wire counterparties (domestic & international)
 * 
 * Uses real banking data (routing numbers, SWIFT codes) from routing-numbers.ts
 */

import { faker } from '@faker-js/faker';
import { REAL_ACH_ROUTING_NUMBERS, REAL_WIRE_ROUTING_NUMBERS, INTERNATIONAL_BANKS } from './routing-numbers';

/**
 * Generate random SSN in format XXX-XX-XXXX
 */
function generateSSN(): string {
  const area = faker.string.numeric(3);
  const group = faker.string.numeric(2);
  const serial = faker.string.numeric(4);
  return `${area}-${group}-${serial}`;
}

/**
 * Generate random EIN in format XX-XXXXXXX
 */
function generateEIN(): string {
  const prefix = faker.string.numeric(2);
  const suffix = faker.string.numeric(7);
  return `${prefix}-${suffix}`;
}

/**
 * Generate random date of birth (18-80 years old)
 */
function generateDateOfBirth(): string {
  const date = faker.date.birthdate({ min: 18, max: 80, mode: 'age' });
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Generate realistic individual customer
 */
export function generateIndividual() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number('##########'), // 10 digits
    ssn: generateSSN(),
    dateOfBirth: generateDateOfBirth(),
    idNumber: generateSSN(), // Same as SSN for individuals
    idType: 'SSN',
    address: {
      line1: faker.location.streetAddress(),
      line2: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.3 }) || '',
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      postalCode: faker.location.zipCode('#####'),
      countryCode: 'US',
      type: 'MAILING'
    }
  };
}

/**
 * Generate realistic business customer
 */
export function generateBusiness() {
  const companyName = faker.company.name();
  
  return {
    legalName: companyName,
    name: companyName,
    dba: faker.helpers.maybe(() => faker.company.name(), { probability: 0.3 }) || undefined,
    ein: generateEIN(),
    businessEntityType: faker.helpers.arrayElement([
      'CORPORATION',
      'LIMITED_LIABILITY_COMPANY',
      'PARTNERSHIP',
      'SOLE_PROPRIETOR'
    ]),
    incorporationState: faker.location.state({ abbreviated: true }),
    formationDate: faker.date.past({ years: 10 }).toISOString().split('T')[0],
    website: faker.internet.url(),
    mobilePhone: faker.phone.number('##########'),
    email: faker.internet.email(),
    phone: faker.phone.number('##########'),
    address: {
      line1: faker.location.streetAddress(),
      line2: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.3 }) || '',
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      postalCode: faker.location.zipCode('#####'),
      countryCode: 'US',
      type: 'MAILING'
    },
    businessIdType: 'EIN',
    idNumber: generateEIN(),
    mcc: faker.helpers.arrayElement(['5411', '5812', '5999', '7372', '8011']),
    naics: faker.helpers.arrayElement(['511210', '541511', '541512', '621111', '722511'])
  };
}

/**
 * Generate ACH counterparty with real routing number
 */
export function generateACHCounterparty() {
  const bank = faker.helpers.arrayElement(REAL_ACH_ROUTING_NUMBERS);
  const isIndividual = faker.datatype.boolean();
  
  return {
    name: isIndividual 
      ? `${faker.person.firstName()} ${faker.person.lastName()}`
      : faker.company.name(),
    type: isIndividual ? 'INDIVIDUAL' : 'BUSINESS',
    email: faker.internet.email(),
    phone: faker.phone.number('##########'),
    ach: {
      accountNumber: faker.finance.accountNumber(10),
      bankName: bank.name,
      bankAccountType: faker.helpers.arrayElement(['CHECKING', 'SAVINGS']),
      routingNumber: bank.routing,
      gatewayRoutingNumber: null,
      rdfiNumberQualifier: null,
      address: {
        line1: faker.location.streetAddress(),
        line2: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.3 }) || null,
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        postalCode: faker.location.zipCode('#####'),
        countryCode: 'US',
        type: 'MAILING'
      }
    }
  };
}

/**
 * Generate domestic wire counterparty with SWIFT code
 */
export function generateDomesticWireCounterparty() {
  const bank = faker.helpers.arrayElement(REAL_WIRE_ROUTING_NUMBERS);
  const isIndividual = faker.datatype.boolean();
  
  return {
    name: isIndividual 
      ? `${faker.person.firstName()} ${faker.person.lastName()}`
      : faker.company.name(),
    type: isIndividual ? 'INDIVIDUAL' : 'BUSINESS',
    email: faker.internet.email(),
    phone: faker.phone.number('##########'),
    wire: {
      type: 'DOMESTIC',
      beneficiaryAccountNumber: faker.finance.accountNumber(10),
      beneficiaryFIName: bank.name,
      beneficiaryFIIdType: 'SWIFT',
      beneficiaryIdNumber: bank.swift,
      receiverRoutingNumber: bank.routing,
      receiverShortName: bank.name.split(' ')[0].substring(0, 18),
      swiftCode: bank.swift,
      bankName: bank.name,
      address: {
        line1: faker.location.streetAddress(),
        line2: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.3 }) || null,
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        postalCode: faker.location.zipCode('#####'),
        countryCode: 'US'
      },
      beneficiaryFIAddress: {
        line1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        postalCode: faker.location.zipCode('#####'),
        countryCode: 'US'
      }
    }
  };
}

/**
 * Generate international wire counterparty with IBAN
 */
export function generateInternationalWireCounterparty() {
  const bank = faker.helpers.arrayElement(INTERNATIONAL_BANKS);
  const isIndividual = faker.datatype.boolean();
  
  return {
    name: isIndividual 
      ? `${faker.person.firstName()} ${faker.person.lastName()}`
      : faker.company.name(),
    type: isIndividual ? 'INDIVIDUAL' : 'BUSINESS',
    email: faker.internet.email(),
    phone: faker.phone.number('##########'),
    wire: {
      type: 'INTERNATIONAL',
      beneficiaryAccountNumber: faker.finance.accountNumber(10),
      beneficiaryFIName: bank.name,
      beneficiaryFIIdType: 'SWIFT',
      beneficiaryIdNumber: bank.swift,
      iban: faker.finance.iban(),
      swiftCode: bank.swift,
      bankName: bank.name,
      country: bank.country,
      address: {
        line1: faker.location.streetAddress(),
        line2: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.3 }) || null,
        city: faker.location.city(),
        postalCode: faker.location.zipCode(),
        countryCode: bank.countryCode
      },
      beneficiaryFIAddress: {
        line1: faker.location.streetAddress(),
        city: faker.location.city(),
        postalCode: faker.location.zipCode(),
        countryCode: bank.countryCode
      }
    }
  };
}

/**
 * Generate random amount between min and max
 */
export function generateAmount(min: number = 1, max: number = 10000): number {
  return parseFloat(faker.finance.amount({ min, max, dec: 2 }));
}

/**
 * Generate transaction description
 */
export function generateTransactionDescription(): string {
  return faker.helpers.arrayElement([
    `Payment for invoice ${faker.string.alphanumeric(8)}`,
    `${faker.company.name()} - ${faker.commerce.productName()}`,
    `Refund for order #${faker.string.numeric(6)}`,
    `Service fee - ${faker.date.recent().toLocaleDateString()}`,
    `Transfer - ${faker.finance.transactionDescription()}`
  ]);
}
