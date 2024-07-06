import ApiClient, { Method } from "../api/ApiClient";
import { Counterparty, CreateCounterparty, IdsListType } from "../api/ApiTypes";

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
    id: string,
    pageSize: number,
    pageNumber: number
  ) {
    const response = await this.apiClient.http<{
      content: Counterparty[];
      totalElements: number;
      number: number;
    }>(
      Method.GET,
      `/counterparty?searchKeyWords=${id}&pageSize=${pageSize}&pageNumber=${pageNumber}`
    );
    return response;
  }

  public async fetchCounterpartyIds(
    id: string,
    pageSize: number,
    pageNumber: number
  ) {
    const response = await this.apiClient.http<any>(
      Method.GET,
      `/counterparty?searchKeyWords=${id}&pageSize=${pageSize}&pageNumber=${pageNumber}`
    );

    let idsList: IdsListType[] = [];

    response.content.forEach((cpt: Counterparty) => {
      idsList.push({ id: cpt.id, name: cpt.name });
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

  public async fetchCounterpartyIdsList() {
    const counterparties = await this.apiClient.http<Counterparty[]>(
      Method.GET,
      `/counterparty`
    );

    console.log("counterparties:", counterparties);

    const counterpartyIds: { id: string; name: string }[] = [];
    counterparties.map((counterparty: Counterparty) => {
      counterpartyIds.push({
        id: counterparty.id ? counterparty.id.toString() : "-1",
        name: counterparty.name ?? "",
      });
    });

    return counterpartyIds;
  }
}

export default CounterpartyRepo;
