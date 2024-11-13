import ApiClient, { Method } from "../api/ApiClient";
import { CreateLimit, RulesAndLimits } from "../api/ApiTypes";

class RulesAndLimitsRepo {
  private apiClient: ApiClient;
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async createLimit(account: CreateLimit) {
    const resp = await this.apiClient.http<RulesAndLimits>(
      Method.POST,
      "/rule",
      account
    );

    return resp;
  }

  public async fetchLimit(id: string) {
    const response = await this.apiClient.http<RulesAndLimits>(
      Method.GET,
      `/rule/${id}`
    );
    return response;
  }

  public async deactivateLimit(id: string) {
    const response = await this.apiClient.http<RulesAndLimits>(
      Method.PATCH,
      `/rule/${id}/deactivate`
    );
    return response;
  }

  public async fetchLimits() {
    const response = await this.apiClient.http<RulesAndLimits[]>(
      Method.POST,
      "/rule",
      {}
    );
    return response;
  }

  public async fetchLimitsByProductId(id: string) {
    const response = await this.apiClient.http<RulesAndLimits[]>(
      Method.POST,
      `/rule/search`,
      {
        productId: id,
      }
    );
    return response;
  }

  public async fetchLimitsByAccountId(id: string) {
    const response = await this.apiClient.http<RulesAndLimits[]>(
      Method.POST,
      `/rule/search`,
      {
        accountNumber: id,
      }
    );
    return response;
  }

  public async fetchAccountLimits(accountNumber: string, productId: number) {
    const response = await this.apiClient.http<RulesAndLimits[]>(
      Method.POST,
      `/rule/search`,
      {
        accountNumber: accountNumber,
        productId: productId,
      }
    );
    return response;
  }

  public async fetchProgramLimits(programId: string) {
    const response = await this.apiClient.http<RulesAndLimits[]>(
      Method.POST,
      `/rule/search`,
      {
        programId: programId,
      }
    );
    return response;
  }
}
export default RulesAndLimitsRepo;
