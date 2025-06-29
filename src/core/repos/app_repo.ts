import ApiClient, { Method } from "../api/ApiClient";
import { CreateProgram, Program } from "../api/ApiTypes";

class AppRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchTimezone() {
    const response = await this.apiClient.http<string>(
      Method.GET,
      "/wire/config"
    );
    return response;
  }
}

export default AppRepo;
