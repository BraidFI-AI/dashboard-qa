import ApiClient, { Method } from "../api/ApiClient";
import { WireInbound } from "../api/ApiTypes";

class WireProcessingRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async processInboundWire(inbound: WireInbound) {
    const response = await this.apiClient.http(
      Method.POST,
      `/transaction/wire/inbound`,
      inbound
    );
    return response;
  }

  public async uploadInboundWireFile(inbound: string, filename?: string) {
    console.log(inbound);
    const response = await this.apiClient.http(
      Method.POST,
      `/wire/load/inbound?continueWithErrors=true${filename != null && filename != '' ? `&filename=${filename}` : ""}`,
      inbound,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );

    return response;
  }

  public async fetchWireTransactionStatus(
    pageSize: number,
    pageNumber: number,
    filename?: string
  ) {
    const response = await this.apiClient.http<any>(
      Method.GET,
      `/wire/load/inbound/status?page=${pageNumber}&size=${pageSize}&${
        filename != null ? `filename=${filename}` : ""
      }`
    );

    return response;
  }

  public async getWireFileProcessingError(id: string) {
    const response = await this.apiClient.http<any>(
      Method.GET,
      `/wire/file-record/${id}`
    );

    return response;
  }

  public async updateWireFileRecord(data: {
    recordId: string;
    accountNumber: string;
    beneficiaryCode: string;
  }) {
    const response = await this.apiClient.http<any>(
      Method.POST,
      `/wire/update-file-record`,
      data
    );

    return response;
  }
}

export default WireProcessingRepo;
