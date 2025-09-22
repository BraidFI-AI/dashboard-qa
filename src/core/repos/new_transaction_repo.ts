import ApiClient, { Method } from "../api/ApiClient";

class NewTransactionRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async transferTransaction(data: {
    amount: number;
    description: string;
    recipientAccountNumber: string;
    senderAccountNumber: string;
  }) {
    return await this.apiClient.http<any>(
      Method.POST,
      `/transaction/internal/transfer`,
      { ...data, reference: "Internal Transfer" }
    );
  }

  public async adjustmentTransaction(data: {
    accountNumber: string;
    amount: number;
    direction: string;
    subType: string;
    description: string;
  }) {
    return await this.apiClient.http<any>(
      Method.POST,
      data.direction == "CREDIT"
        ? `/transaction/adjustment/credit`
        : `/transaction/adjustment/debit`,
      {
        accountNumber: data.accountNumber,
        amount: data.amount,
        subType: data.subType,
        description: data.description,
      }
    );
  }

  public async createWireTransaction(data: {
    amount: number;
    description: string;
    accountNumber: string;
    counterpartyId: string;
    counterpartyType: string;
  }) {
    return await this.apiClient.http<any>(
      Method.POST,
      data.counterpartyType == "INTERNATIONAL"
        ? `/transaction/wire/international`
        : `/transaction/wire/outbound`,
      {
        amount: data.amount,
        description: data.description,
        accountNumber: data.accountNumber,
        counterpartyId: data.counterpartyId,
      }
    );
  }
}

export default NewTransactionRepo;
