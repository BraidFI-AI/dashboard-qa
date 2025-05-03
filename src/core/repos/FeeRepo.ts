import ApiClient, { Method } from "../api/ApiClient";
import { Fees } from "../api/ApiTypes";

class FeeRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchFees() {
    const response = await this.apiClient.http<Fees[]>(Method.GET, "/fee");
    return response;
  }

  public async fetchFee(id: string) {
    const fee = await this.apiClient.http<Fees>(Method.GET, `/fee/${id}`);

    return fee;
  }

  public async fetchFeesByProductId(id: string) {
    const response = await this.apiClient.http<Fees[]>(
      Method.GET,
      `/fee?productId=${id}`
    );
    return response;
  }

  public async fetchFeesByProgramId(id: string) {
    const response = await this.apiClient.http<Fees[]>(
      Method.GET,
      `/fee?programId=${id}`
    );
    return response;
  }

  public async fetchFeesByAccountId(id: string) {
    const response = await this.apiClient.http<Fees[]>(
      Method.GET,
      `/fee?accountNumber=${id}`
    );
    return response;
  }

  public async createFee(fees: any) {
    const fee = await this.apiClient.http<Fees>(Method.POST, `/fee`, fees);

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
