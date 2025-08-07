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
    let body: any = {
      postDateStart: beginDate,
      postDateEnd: endDate,
      reconStatuses: ["EXCEPTION"],
      transactionStatus: ["POSTED"],
    };

    if (transactionType == "ACH") {
      body = {
        ...body,
        transactionType: [
          "ACH_DEPOSIT",
          "ACH_WITHDRAWAL",
          "ACH_ORIGINATOR_CREDIT",
          "ACH_ORIGINATOR_DEBIT",
          "ACH_RECEIVER_CREDIT",
          "ACH_RECEIVER_CREDIT_RETURN",
          "ACH_RECEIVER_DEBIT",
          "ACH_RETURNED_DEPOSIT",
          "ACH_RETURNED_WITHDRAWAL",
          "ACH_RETURNED_ORIGINATOR_CREDIT",
          "ACH_RETURNED_ORIGINATOR_DEBIT",
          "ACH_RETURNED_ADMIN_DEPOSIT",
          "ACH_RETURNED_ADMIN_WITHDRAWAL",
          "ACH_RETURNED_ADMIN_ORIGINATOR_CREDIT",
          "ACH_RETURNED_ADMIN_ORIGINATOR_DEBIT",
          "ACH_RETURNED_UNAUTH_DEPOSIT",
          "ACH_RETURNED_UNAUTH_WITHDRAWAL",
          "ACH_RETURNED_UNAUTH_ORIGINATOR_CREDIT",
          "ACH_RETURNED_UNAUTH_ORIGINATOR_DEBIT",
          "ACH_RETURNED_NSF_ORIGINATOR_DEBIT",
        ],
      };
    } else {
      body = {
        ...body,
        transactionType: [
          "WIRE_DOMESTIC_DEBIT",
          "WIRE_DOMESTIC_CREDIT",
          "WIRE_INTERNATIONAL_CREDIT",
          "WIRE_INTERNATIONAL_DEBIT",
          "WIRE_INTERNATIONAL_CREDIT_RETURN",
          "WIRE_INTERNATIONAL_DEBIT_RETURN",
          "WIRE_DOMESTIC_CREDIT_RETURN",
          "WIRE_DOMESTIC_DEBIT_RETURN",
        ],
      };
    }

    const response = await this.apiClient.http<any>(
      Method.POST,
      `/transaction/search?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      body
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
    paymentId: string;
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
