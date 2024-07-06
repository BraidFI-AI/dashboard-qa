import ApiClient, { Method } from "../api/ApiClient";
import { CreateProgram, Program } from "../api/ApiTypes";

class ProgramRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchPrograms() {
    const response = await this.apiClient.http<Program[]>(
      Method.GET,
      "/program"
    );
    return response;
  }

  public async fetchProgram(programId: number) {
    const program = await this.apiClient.http<Program>(
      Method.GET,
      `/program/${programId}`
    );

    return program;
  }

  public async createProgram(program: CreateProgram) {
    await this.apiClient.http<Program>(Method.POST, `/program`, program);
  }

  public async updateProgram(id: number, program: CreateProgram) {
    const resp = await this.apiClient.http<Program>(
      Method.PUT,
      `/program/${id}`,
      program
    );
    return resp;
  }

  public async createProgramBaseUrl(id: number, url: string) {
    const data = await this.apiClient.http<string>(
      Method.PATCH,
      `/program/${id}/baseUrl`,
      url
    );

    return data;
  }

  public async fetchProgramIdsList() {
    const programs = await this.apiClient.http<Program[]>(
      Method.GET,
      `/program`
    );

    const ids: string[] = [];

    programs.forEach((program: Program) => {
      ids.push(program.id.toString());
    });

    return ids;
  }

  public async fetchProgramIdsListWithNames() {
    const programs = await this.apiClient.http<Program[]>(
      Method.GET,
      `/program`
    );

    const ids: { name: string; id: string }[] = [];

    programs.forEach((program: Program) => {
      ids.push({ id: program.id.toString(), name: program.name ?? "" });
    });

    return ids;
  }
}

export default ProgramRepo;
