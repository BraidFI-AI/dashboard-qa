import ApiClient, { Method } from "../api/ApiClient";
import {
  CreateForm,
  CustomizableForm,
  CustomizableFormQuestion,
} from "../api/ApiTypes";

class CustomizableFormRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchForms() {
    const response = await this.apiClient.http<CustomizableForm[]>(
      Method.GET,
      "/questionset"
    );

    const latestVersions: CustomizableForm[] = [];

    for (const obj of response) {
      const { questionSetId, version } = obj;
      if (
        !latestVersions[questionSetId] ||
        version > latestVersions[questionSetId].version
      ) {
        latestVersions[questionSetId] = obj;
      }
    }

    const result = Object.values(latestVersions);

    return result;
  }

  public async fetchForm(id: number, version?: number) {
    const response = await this.apiClient.http<CustomizableForm[]>(
      Method.GET,
      `/questionset/${id}${version ? `?questionSetVersion=${version}` : ""}`
    );
    if (version) {
      return response;
    } else {
      return response[0];
    }
  }

  public async createForm(form: CreateForm) {
    await this.apiClient.http<CreateForm>(Method.POST, "/questionset", form);
  }

  public async updateQuestion(question: CustomizableFormQuestion) {
    const resp = await this.apiClient.http<CreateForm>(
      Method.PUT,
      `/questionset/${question.questionSetId}/question/${question.id}`,
      question
    );

    return resp;
  }

  public async addQuestion(id: number, question: any) {
    const resp = await this.apiClient.http<any>(
      Method.POST,
      `/questionset/${id}/question`,
      question
    );

    return resp[0];
  }

  public async deleteQuestion(id: number, questionId: any) {
    const resp = await this.apiClient.http<any>(
      Method.DELETE,
      `/questionset/${id}/question/${questionId}`
    );
  }
}

export default CustomizableFormRepo;
