import ApiClient from "../api/ApiClient";

class ClearSightRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }
}

export default ClearSightRepo;
