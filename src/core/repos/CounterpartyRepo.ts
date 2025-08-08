import ApiClient, { Method } from "../api/ApiClient";
import {
  Counterparty,
  CreateCounterparty,
  IdsListType,
  SearchCounterparty,
} from "../api/ApiTypes";

class CounterpartyRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async unblockCounterparty(id: number) {
    const response = await this.apiClient.http<Counterparty[]>(
      Method.POST,
      `/counterparty/unblock/${id}`
    );
    return response;
  }

  public async fetchCounterparties(
    search: SearchCounterparty,
    pageSize: number,
    pageNumber: number
  ) {
    const response = await this.apiClient.http<{
      content: Counterparty[];
      totalElements: number;
      number: number;
    }>(
      Method.POST,
      `/counterparty/search?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      search
    );
    return response;
  }

  public async fetchCounterpartyIds(
    search: SearchCounterparty,
    pageSize: number,
    pageNumber: number
  ) {
    const response = await this.apiClient.http<any>(
      Method.POST,
      `/counterparty/search?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      search
    );

    let idsList: IdsListType[] = [];

    response.content.forEach((cpt: Counterparty) => {
      idsList.push({ id: cpt.id ?? null, name: cpt.name ?? null });
    });

    return { next: response.nextPage, ids: idsList };
  }

  public async fetchCounterparty(id: number) {
    const counterparty = await this.apiClient.http<Counterparty>(
      Method.GET,
      `/counterparty/${id}`
    );

    return counterparty;
  }

  public async createCounterparty(counterparty: CreateCounterparty) {
    const resp = await this.apiClient.http<Counterparty>(
      Method.POST,
      `/counterparty`,
      counterparty
    );

    return resp;
  }

  public async updateCounterparty(id: number, counterparty: Counterparty) {
    await this.apiClient.http<Counterparty>(
      Method.PUT,
      `/counterparty/${id}`,
      counterparty
    );
  }
}

export default CounterpartyRepo;
