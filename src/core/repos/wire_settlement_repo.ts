import ApiClient, { Method } from "../api/ApiClient";

class WireRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchWireSettlementHistory(startDate: string, endDate: string) {
    const response = await this.apiClient.http<any[]>(
      Method.GET,
      `/wire/settlement?startDate=${startDate}&endDate=${endDate}`
    );
    console.log(response);
    return response;
  }

  public async approveSettlement(filename: string) {
    const response = await this.apiClient.http<any[]>(
      Method.POST,
      `/wire/settlement/${filename}/approve`
    );
    return response;
  }

  public async runSettlement() {
    const response = await this.apiClient.http<any[]>(
      Method.POST,
      `/wire/settlement/generate`,
      {}
    );
    return response;
  }

  public async downloadWireSettlementFile(filename: string) {
    try {
      const response = await this.apiClient.downloadWireSettlementFile(
        filename
      );

      return response;
    } catch (e: any) {
      throw e;
    }
  }
}

export default WireRepo;
