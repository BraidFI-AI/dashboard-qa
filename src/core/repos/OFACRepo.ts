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
    // check if filters object is undefined or it has no properties
    if (filters && Object.keys(filters).length === 0) {
      filters = undefined;
    }

    let params: string = filters == undefined ? "" : "&";
    params += filters?.status == null ? "" : `status=${filters.status}&`;
    params +=
      filters?.startDate == null ? "" : `startDate=${filters.startDate}&`;
    params += filters?.endDate == null ? "" : `endDate=${filters.endDate}&`;
    params +=
      filters?.entityType == null ? "" : `entityType=${filters.entityType}`;

    const response = await this.apiClient.http<any>(
      Method.GET,
      `/OFAC?pageSize=${pageSize}&pageNumber=${pageNumber}${params}`
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
