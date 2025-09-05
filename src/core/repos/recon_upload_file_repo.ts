import ApiClient, { Method } from "../api/ApiClient";

class ReconUploadFileRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async uploadWireFile(file: any) {
    const data = await this.apiClient.uploadFilePost(
      `/reconciliation/wire-file-upload`,
      file
    );

    return data;
  }

  public async uploadACHFile(file: any) {
    const data = await this.apiClient.uploadFilePost(
      `/reconciliation/ach-file-upload`,
      file
    );

    return data;
  }

  public async getUploadStatus(pageSize: number, pageNumber: number) {
    const data = await this.apiClient.http(
      Method.POST,
      `/reconciliation/audits/search?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      {}
    );

    return data;
  }
}

export default ReconUploadFileRepo;
