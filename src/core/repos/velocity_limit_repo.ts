import ApiClient, { Method } from "../api/ApiClient";

class VelocityLimitRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchVelocityLimits(pageSize: number, pageNumber: number) {
    const response = await this.apiClient.http<any>(
      Method.POST,
      `/rule/search?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      {}
    );
    return response;
  }

  public async createReceiverMatchLimit(data: {
    limitName: string;
    programId: string;
    volume: number;
    action: string;
  }) {
    const response = await this.apiClient.http<any>(
      Method.POST,
      `/rule/receiver-match`,
      data
    );
    return response;
  }

  public async createRoundedNumberLimit(data: {
    limitName: string;
    programId: string;
    volume: number;
    action: string;
    transactionGroups?: string[];
    transactionTypes?: string[];
  }) {
    const response = await this.apiClient.http<any>(
      Method.POST,
      `/rule/rounded-number`,
      data
    );
    return response;
  }

  public async createTransactionLimit(data: {
    limitName: string;
    volume?: number;
    aggregationDays?: string;
    frequencyMax?: string;
    aggregationLevel: string;
    associatedEntityType: string;
    associatedEntityId?: string;
    action: string;
    transactionGroups?: string[];
    transactionTypes?: string[];
    restrictedEntities?: {
      entityType: string;
      entityName: string;
      entityCode?: string;
    }[];
  }) {
    const response = await this.apiClient.http<any>(Method.POST, `/rule`, data);
    return response;
  }

  public async getRestrictedEntities() {
    const response = await this.apiClient.http<any>(
      Method.GET,
      `/rule/all-countries`
    );
    return response;
  }

  public async deactivateVelocityLimit(limitId: string) {
    const response = await this.apiClient.http<any>(
      Method.PATCH,
      `/rule/${limitId}/deactivate`
    );
    return response;
  }
}

export default VelocityLimitRepo;
