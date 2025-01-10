import ApiClient, { Method } from "../api/ApiClient";
import { Statement } from "../api/ApiTypes";

class StatementRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchRootStatement(start: string, end: string) {
    const response = await this.apiClient.http<Statement>(
      Method.GET,
      `/statement/account/root?start=${start}&end=${end}`
    );
    return response;
  }

  public async fetchProgramStatement(
    start: string,
    end: string,
    programId: string
  ) {
    const response = await this.apiClient.http<Statement>(
      Method.GET,
      `/statement/program/${programId}?start=${start}&end=${end}`
    );
    return response;
  }

  public async fetchProductStatement(
    start: string,
    end: string,
    productId: string
  ) {
    const response = await this.apiClient.http<Statement>(
      Method.GET,
      `/statement/product/${productId}?start=${start}&end=${end}`
    );
    return response;
  }

  public async fetchAccountStatement(
    start: string,
    end: string,
    accountId: string
  ) {
    const response = await this.apiClient.http<Statement>(
      Method.GET,
      `/v2/statement/account/${accountId}?start=${start}&end=${end}`
    );
    return response;
  }
}

export default StatementRepo;
