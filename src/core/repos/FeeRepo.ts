import ApiClient, { Method } from "../api/ApiClient";
import { CreateFee, Fees, FeeSearch } from "../api/ApiTypes";

class FeeRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async feeSearch(
    body: FeeSearch,
    pageSize: number,
    pageNumber: number
  ) {
    const response = await this.apiClient.http<any>(
      Method.POST,
      `/v2/fee/search?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      body
    );
    return response;
  }

  public async fetchFee(id: string) {
    const fee = await this.apiClient.http<Fees>(Method.GET, `/v2/fee/${id}`);

    return fee;
  }

  public async fetchFeesByProductId(id: string) {
    const response = await this.apiClient.http<Fees[]>(
      Method.GET,
      `/fee?productId=${id}`
    );
    return response;
  }

  // public async fetchFeesByProgramId(id: string) {
  //   const response = await this.apiClient.http<Fees[]>(
  //     Method.GET,
  //     `/fee?programId=${id}`
  //   );
  //   return response;
  // }

  public async fetchFeesByAccountId(id: string) {
    const response = await this.apiClient.http<Fees[]>(
      Method.GET,
      `/fee?accountNumber=${id}`
    );
    return response;
  }

  public async createFee(fees: CreateFee) {
    const fee = await this.apiClient.http<Fees>(Method.POST, `/v2/fee`, fees);

    return fee;
  }

  public async updateFee(fees: any) {
    const fee = await this.apiClient.http<Fees>(
      Method.PUT,
      `/fee/${fees.id}`,
      fees
    );

    return fee;
  }

  public async deleteFee(id: string) {
    const fee = await this.apiClient.http<Fees>(Method.DELETE, `/fee/${id}`);

    return fee;
  }
}

export default FeeRepo;
