/**
 * Test Data Cleanup Utility
 * 
 * Tracks all entities created during test execution and provides cleanup methods.
 * Used to maintain clean test environment and prevent data pollution.
 */

import apiClient from './api-client';

interface TestEntities {
  customers: number[];
  counterparties: number[];
  transactions: number[];
  accounts: string[]; // Account numbers
}

class TestCleanup {
  private entities: TestEntities = {
    customers: [],
    counterparties: [],
    transactions: [],
    accounts: []
  };

  private testRunManifest: any[] = [];

  /**
   * Add customer ID to cleanup list
   */
  addCustomer(id: number): void {
    this.entities.customers.push(id);
    console.log(`  📝 Tracked customer: ${id} for cleanup`);
  }

  /**
   * Add counterparty ID to cleanup list
   */
  addCounterparty(id: number): void {
    this.entities.counterparties.push(id);
    console.log(`  📝 Tracked counterparty: ${id} for cleanup`);
  }

  /**
   * Add transaction ID to cleanup list
   */
  addTransaction(id: number): void {
    this.entities.transactions.push(id);
    console.log(`  📝 Tracked transaction: ${id} for cleanup`);
  }

  /**
   * Add account number to cleanup list
   */
  addAccount(accountNumber: string): void {
    this.entities.accounts.push(accountNumber);
    console.log(`  📝 Tracked account: ${accountNumber} for cleanup`);
  }

  /**
   * Get count of tracked entities
   */
  getEntityCounts(): TestEntities {
    return { ...this.entities };
  }

  /**
   * Clean up all tracked customers
   */
  async cleanupCustomers(): Promise<void> {
    console.log(`\n🧹 Cleaning up ${this.entities.customers.length} customers...`);
    
    for (const customerId of this.entities.customers) {
      try {
        await apiClient.delete(`/individual/${customerId}`);
        console.log(`  ✓ Deleted customer ${customerId}`);
      } catch (error: any) {
        console.warn(`  ⚠ Failed to delete customer ${customerId}:`, error.message);
      }
    }
    
    this.entities.customers = [];
  }

  /**
   * Clean up all tracked counterparties
   */
  async cleanupCounterparties(): Promise<void> {
    console.log(`\n🧹 Cleaning up ${this.entities.counterparties.length} counterparties...`);
    
    for (const counterpartyId of this.entities.counterparties) {
      try {
        await apiClient.delete(`/counterparty/${counterpartyId}`);
        console.log(`  ✓ Deleted counterparty ${counterpartyId}`);
      } catch (error: any) {
        console.warn(`  ⚠ Failed to delete counterparty ${counterpartyId}:`, error.message);
      }
    }
    
    this.entities.counterparties = [];
  }

  /**
   * Clean up all tracked transactions
   */
  async cleanupTransactions(): Promise<void> {
    console.log(`\n🧹 Cleaning up ${this.entities.transactions.length} transactions...`);
    
    // Note: Transactions might not be deletable in Braid
    // This is here for reference, adjust based on API capabilities
    for (const transactionId of this.entities.transactions) {
      try {
        // Check if transaction delete is supported
        // await apiClient.delete(`/transaction/${transactionId}`);
        console.log(`  ℹ Transaction ${transactionId} marked for cleanup (delete not supported)`);
      } catch (error: any) {
        console.warn(`  ⚠ Failed to delete transaction ${transactionId}:`, error.message);
      }
    }
    
    this.entities.transactions = [];
  }

  /**
   * Clean up all tracked entities
   */
  async cleanupAll(): Promise<void> {
    console.log('\n🧹 Starting cleanup of all test entities...');
    
    const startTime = Date.now();
    
    // Clean up in reverse order of dependencies
    // Transactions depend on accounts/counterparties
    await this.cleanupTransactions();
    
    // Counterparties are independent
    await this.cleanupCounterparties();
    
    // Customers have accounts, clean them last
    await this.cleanupCustomers();
    
    const duration = Date.now() - startTime;
    console.log(`\n✓ Cleanup completed in ${duration}ms\n`);
  }

  /**
   * Reset cleanup state (for new test run)
   */
  reset(): void {
    this.entities = {
      customers: [],
      counterparties: [],
      transactions: [],
      accounts: []
    };
    console.log('🔄 Cleanup state reset');
  }

  /**
   * Save test run manifest for reference
   */
  saveManifest(testName: string, entities: any): void {
    this.testRunManifest.push({
      testName,
      timestamp: new Date().toISOString(),
      entities
    });
  }

  /**
   * Get full test run manifest
   */
  getManifest(): any[] {
    return this.testRunManifest;
  }
}

// Export singleton instance
export const testCleanup = new TestCleanup();

export default testCleanup;
