import ApiClient, { Method } from "../api/ApiClient";
import { OFAC } from "../api/ApiTypes";

class OFACRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchOFACHits() {
    const response = await this.apiClient.http<OFAC[]>(Method.GET, `/OFAC`);
    return response;
  }

  public async fetchOFACHit(id: string) {
    const response = await this.apiClient.http<OFAC[]>(
      Method.GET,
      `/OFAC/${id}`
    );
    return response;
  }

  public async updateOFACHit(
    id: string,
    data: { status: string; note: string }
  ) {
    const response = await this.apiClient.http<OFAC[]>(
      Method.PUT,
      `/OFAC/${id}`,
      data
    );
    return response;
  }
}

export default OFACRepo;
