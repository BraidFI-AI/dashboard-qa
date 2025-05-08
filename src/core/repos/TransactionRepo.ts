import ApiClient, { Method } from "../api/ApiClient";
import { Transaction, TransactionSearch } from "../api/ApiTypes";
import { v4 as uuidv4 } from "uuid";

class TransactionRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchTransactions(
    criteria: TransactionSearch,
    pageSize: number,
    pageNumber: number
  ) {
    const resp: {
      content: Transaction[];
      totalElements: number;
      number: number;
    } = await this.apiClient.http(
      Method.POST,
      `/transaction/search?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      { ...criteria, includeRawData: true }
    );

    const transactions = resp.content;

    transactions.forEach((transaction: Transaction) => {
      transaction.customUUID = uuidv4();
    });

    resp.content = transactions;

    return resp;
  }

  public async fetchTransactionByPaymentId(paymentId: string) {
    const trans = await this.apiClient.http<any>(
      Method.POST,
      "/transaction/search",
      {
        paymentId: paymentId,
        includeRawData: true,
      }
    );

    return trans.content;
  }

  public async fetchTransactionTypes() {
    const types = await this.apiClient.http<string[]>(
      Method.GET,
      "/transaction/transactionTypes"
    );

    return types;
  }

  public async fetchAchReturnCodes() {
    const types = await this.apiClient.http<string[]>(
      Method.GET,
      "/transaction/ach/returnCodes"
    );

    const codes = types.map((code: any) => {
      return code.name ?? "";
    });

    return codes;
  }

  public async fetchToReviewACHTransactions(
    pageSize: number,
    pageNumber: number,
    filter: {
      wireFileHandle?: string;
    }
  ) {
    const resp = await this.apiClient.http<{
      content: Transaction[];
      totalElements: number;
      number: number;
    }>(
      Method.POST,
      `/transaction/search?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      { ...filter, processingStatus: ["MANUAL_REVIEW"] }
    );

    const transactions = resp.content;

    resp.content = transactions;

    return resp;
  }

  public async fetchBreachedLimitsNew(id: string) {
    let breachedLimits = await this.apiClient.http<any[]>(
      Method.GET,
      `/rule/checks/${id}`
    );

    breachedLimits = breachedLimits.filter(
      (limit: any) => limit.result != "PASS"
    );
    const limits = [];

    for (const limit of breachedLimits) {
      limits.push(limit);
    }

    return limits;
  }

  public async fetchBreachedLimits(id: string) {
    let breachedLimits = await this.apiClient.http<any[]>(
      Method.GET,
      `/rule/checks/${id}`
    );

    breachedLimits = breachedLimits.filter(
      (limit: any) => limit.result == "FLAGGED"
    );
    const limits = [];

    for (const limit of breachedLimits) {
      limits.push(limit.velocityLimit);
    }

    return limits;
  }

  public async returnAchTransaction(data: {
    paymentId: string;
    returnCode: string;
  }) {
    const types = await this.apiClient.http<any>(
      Method.POST,
      "/transaction/ach/return",
      { ...data, sendReturnFile: true }
    );

    return types;
  }

  public async returnWireTransaction(data: {
    paymentId: string;
    returnCode: string;
  }) {
    const types = await this.apiClient.http<any>(
      Method.POST,
      "/transaction/wire/return",
      data
    );

    return types;
  }

  public async cancelTransaction(data: { paymentId: string; reason: string }) {
    const types = await this.apiClient.http<any>(
      Method.PUT,
      "/transaction/pending/cancel",
      {
        paymentId: data.paymentId,
        reason: data.reason,
      }
    );

    return types;
  }
}

export default TransactionRepo;
