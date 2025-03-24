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
          }
        : {
            beginDate: beginDate,
            endDate: endDate,
            excludeAch: true,
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
      `/reconciliation/${transactionType.toLowerCase()}/exceptions?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      {
        beginDate: beginDate,
        endDate: endDate,
      }
    );
    return response;
  }
}

export default ReconExceptionReviewRepo;
