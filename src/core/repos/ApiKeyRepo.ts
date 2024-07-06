import ApiClient, { Method } from "../api/ApiClient";
import { ApiKey } from "../api/ApiTypes";

class ApiKeyRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchApiKey() {
    const response = await this.apiClient.http<ApiKey>(
      Method.GET,
      "/me/api-key"
    );
    console.log(response);
    return response;
  }
}

export default ApiKeyRepo;
