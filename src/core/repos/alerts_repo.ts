import ApiClient, { Method } from "../api/ApiClient";
import { Alert, AlertSearch } from "../api/ApiTypes";

class AlertsRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchAlerts(
    pageSize: number,
    pageNumber: number,
    filters: AlertSearch
  ) {
    const response = await this.apiClient.http<any>(
      Method.POST,
      `/alerts/search?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      filters
    );
    return response;
  }

  public async assignAlertToUser(alertId: string, username: string | null) {
    const response = await this.apiClient.http<any>(
      Method.POST,
      "/alerts/assign",
      {
        alertId: alertId,
        username: username,
      }
    );
    return response;
  }

  public async fetchAlert(id: string | number) {
    const response = await this.apiClient.http<Alert>(
      Method.GET,
      `/alerts/${id}`
    );
    return response;
  }

  public async fetchOpenAlertsCount() {
    const response = await this.apiClient.http<{
      allOpenAlerts: number;
      assignedOpenAlerts: number;
    }>(Method.GET, `/alerts/open`);
    return response;
  }

  public async addAlertNote(id: string, note: string) {
    const response = await this.apiClient.http<any>(
      Method.PUT,
      `/alerts/${id}/add-note?note=${note}`
    );
    return response;
  }

  public async esclateAlert(data: {
    alertIds: string[];
    name: string;
    description: string;
  }) {
    const response = await this.apiClient.http<any>(
      Method.POST,
      `/cases/create`,
      data
    );
    return response;
  }

  public async resolveAlert(data: {
    alertId: string;
    action: string;
    note: string;
    returnCode?: string;
  }) {
    const response = await this.apiClient.http<any>(
      Method.PUT,
      `/alerts/${data.alertId}/status`,
      {
        action: data.action,
        note: data.note,
        returnCode: data.returnCode,
      }
    );
    return response;
  }

  public async createAlertDocument(data: {
    alertId: string;
    description: string;
    documentType: string;
    name: string;
  }) {
    const response = await this.apiClient.http<any>(
      Method.PUT,
      `/alerts/${data.alertId}/create-document`,
      { ...data, attributes: {} }
    );
    return response;
  }

  public async uploadAlertDocument(
    alertId: string,
    documentId: string,
    file: any
  ) {
    const data = await this.apiClient.uploadFile(
      `/alerts/${alertId}/document/${documentId}/upload`,
      file
    );

    return data;
  }

  public async whiteListEntity(ofacId: string) {
    const response = await this.apiClient.http<any>(
      Method.POST,
      `/OFAC/whitelist`,
      { ofacId }
    );
    return response;
  }

  public async updateAlertRfiStatus(data: {
    alertId: string;
    rfiStatus: string;
  }) {
    const response = await this.apiClient.http<any>(
      Method.POST,
      `/alerts/rfi/${data.alertId}?rfiStatus=${data.rfiStatus}`
    );
    return response;
  }
}

export default AlertsRepo;
