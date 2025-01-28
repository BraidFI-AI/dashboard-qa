import ApiClient, { Method } from "../api/ApiClient";

class WireRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchWireReturnFiles(startDate?: string, endDate?: string) {
    var url = `/wire/returnFiles?`;

    if (startDate != undefined) {
      url += `startDate=${startDate}&`;
    }
    if (endDate != undefined) {
      url += `endDate=${endDate}&`;
    }

    const response = await this.apiClient.http<any[]>(Method.GET, url);
    console.log(response);
    return response;
  }

  public async runReturnSettlement() {
    const response = await this.apiClient.http<any[]>(
      Method.POST,
      `/wire/returnFiles/generate`
    );
    console.log(response);
    return response;
  }

  public async downloadWireReturnFile(filename: string) {
    try {
      const response = await this.apiClient.downloadWireReturnFile(filename);

      return response;
    } catch (e: any) {
      throw e;
    }
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

  public async approveReturnSettlement(filename: string) {
    const response = await this.apiClient.http<any[]>(
      Method.POST,
      `/wire/returnFiles/${filename}/approve`
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
