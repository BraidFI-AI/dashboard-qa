import ApiClient, { Method } from "../api/ApiClient";

class ReconExceptionReviewRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchTransactionsPaginated(
    pageSize: number,
    pageNumber: number,
    beginDate: string,
    endDate: string,
    transactionType: "ACH" | "WIRE"
  ) {
    const response = await this.apiClient.http<any>(
      Method.POST,
      `/reconciliation/transaction/exceptions?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      transactionType == "ACH"
        ? {
            beginDate: beginDate,
            endDate: endDate,
            excludeWire: true,
            reconStatuses: ["EXCEPTION"],
          }
        : {
            beginDate: beginDate,
            endDate: endDate,
            excludeAch: true,
            reconStatuses: ["EXCEPTION"],
          }
    );
    return response;
  }

  public async fetchSettlementsPaginated(
    pageSize: number,
    pageNumber: number,
    beginDate: string,
    endDate: string,
    transactionType: "ACH" | "WIRE"
  ) {
    const response = await this.apiClient.http<any>(
      Method.POST,
      `/reconciliation/${transactionType.toLowerCase()}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      {
        beginDate: beginDate,
        endDate: endDate,
        reconStatuses: ["EXCEPTION"],
      }
    );
    return response;
  }

  public async performManualMatch(data: {
    notes: string;
    transactionAuditId: string;
    settlementFileId: string;
    settlementFileType: "ACH" | "WIRE";
  }) {
    const response = await this.apiClient.http<any>(
      Method.POST,
      `/reconciliation/manual-match`,
      data
    );
    return response;
  }
}

export default ReconExceptionReviewRepo;
