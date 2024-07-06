import ApiClient, { Method } from "../api/ApiClient";

class NocRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchNoc(pageSize: number, pageNumber: number) {
    const response = await this.apiClient.http<any>(
      Method.POST,
      `/transaction/ach/noc/search?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      {}
    );
    return response;
  }
}

export default NocRepo;
