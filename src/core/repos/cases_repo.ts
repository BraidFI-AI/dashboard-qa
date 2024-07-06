import ApiClient, { Method } from "../api/ApiClient";
import { Case } from "../api/ApiTypes";

class CasesRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchCases(pageSize: number, pageNumber: number) {
    const response = await this.apiClient.http<any>(
      Method.POST,
      `/cases/search?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      {}
    );
    return response;
  }

  public async fetchCase(id: string | number) {
    const response = await this.apiClient.http<Case>(
      Method.GET,
      `/cases/${id}`
    );
    return response;
  }

  public async addCaseNote(id: string, note: string) {
    const response = await this.apiClient.http<any>(
      Method.PUT,
      `/cases/${id}/add-note?note=${note}`
    );
    return response;
  }

  public async resolveCase(data: {
    caseId: string;
    note: string;
    updateAttachedAlerts: boolean;
    action: string;
  }) {
    const response = await this.apiClient.http<any>(
      Method.PUT,
      `/cases/${data.caseId}/status?updateAttachedAlerts=${data.updateAttachedAlerts}&action=${data.action}&note=${data.note}`
    );
    return response;
  }

  public async createCaseDocument(data: {
    caseId: string;
    description: string;
    documentType: string;
    name: string;
  }) {
    const response = await this.apiClient.http<any>(
      Method.PUT,
      `/cases/${data.caseId}/create-document`,
      { ...data, attributes: {} }
    );
    return response;
  }

  public async uploadCaseDocument(
    caseId: string,
    documentId: string,
    file: any
  ) {
    const data = await this.apiClient.uploadFile(
      `/cases/${caseId}/document/${documentId}/upload`,
      file
    );

    return data;
  }
}

export default CasesRepo;
