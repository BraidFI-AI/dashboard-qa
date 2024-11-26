import ApiClient, { Method } from "../api/ApiClient";

class Compliance314aRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async upload314aFile(file: any) {
    const data = await this.apiClient.uploadFilePost(`/upload/314a-file`, file);
    return data;
  }

  public async fetch314aData(pageSize: number, pageNumber: number) {
    const data = await this.apiClient.http<any>(
      Method.GET,
      `/314A?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return data;
  }

  public async fetch314aRecord(id: string) {
    const data = await this.apiClient.http<any>(Method.GET, `/314A/${id}`);
    return data;
  }
}

export default Compliance314aRepo;
