import ApiClient, { Method } from "../api/ApiClient";
import { ApiKey } from "../api/ApiTypes";

class EncryptionRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async decrypt(data: any) {
    const response = await this.apiClient.http<ApiKey>(
      Method.POST,
      "/decrypt",
      {
        value: data,
      }
    );
    console.log(response);
    return response;
  }
}

export default EncryptionRepo;
