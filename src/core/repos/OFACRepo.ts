import ApiClient, { Method } from "../api/ApiClient";
import { OFAC, OFACSearch } from "../api/ApiTypes";

class OFACRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchOFACHits(
    pageSize: number,
    pageNumber: number,
    filters?: OFACSearch
  ) {
    const response = await this.apiClient.http<any>(
      Method.GET,
      `/OFAC?pageSize=${pageSize}&pageNumber=${pageNumber}${
        filters?.status == null ? "" : `&status=${filters?.status}`
      }`
    );
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
