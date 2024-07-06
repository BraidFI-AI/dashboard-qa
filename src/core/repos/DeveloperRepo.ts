import ApiClient, { Method } from "../api/ApiClient";
import { CreateDeveloper, Developer } from "../api/ApiTypes";

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
}

export default DeveloperRepo;
