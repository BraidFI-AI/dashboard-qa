import ApiClient from "../api/ApiClient";

class Compliance314aRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async upload314aFile(file: any) {
    const data = await this.apiClient.uploadFilePost(`/upload/314a-file`, file);
    return data;
  }
}

export default Compliance314aRepo;
