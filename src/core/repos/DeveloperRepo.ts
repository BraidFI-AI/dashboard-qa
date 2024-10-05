import ApiClient, { Method } from "../api/ApiClient";
import { CreateDeveloper, Developer, WhitelistedIP } from "../api/ApiTypes";

class DeveloperRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchDevelopers() {
    const response = await this.apiClient.http<Developer[]>(
      Method.GET,
      "/developer"
    );
    return response;
  }

  public async fetchDeveloper(id: string) {
    const dev = await this.apiClient.http<Developer>(
      Method.GET,
      `/developer/${id}`
    );

    return dev;
  }

  public async createDeveloper(developer: CreateDeveloper) {
    await this.apiClient.http<Developer>(Method.POST, `/developer`, developer);
  }

  public async fetchTenetIdsList() {
    const developers = await this.apiClient.http<Developer[]>(
      Method.GET,
      `/developer`
    );

    const tenetIds: string[] = [];
    developers.map((developer: Developer) => {
      tenetIds.push(developer.tenantId!);
    });

    return tenetIds;
  }

  public async fetchDeveloperWhitelistedIPs(
    id: string,
    pageSize: number,
    pageNumber: number
  ) {
    return await this.apiClient.http<any>(
      Method.GET,
      `/developer/whitelist-ip?tenantId=${id}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  public async whitelistDeveloperIP(id: string, ip: string) {
    await this.apiClient.http<WhitelistedIP>(
      Method.POST,
      `/developer/whitelist-ip`,
      { tenantId: id, ipAddress: ip }
    );
  }

  public async deleteWhitelistedDeveloperIP(id: string) {
    return await this.apiClient.http<WhitelistedIP>(
      Method.DELETE,
      `/developer/whitelist-ip/${id}`
    );
  }
}

export default DeveloperRepo;
