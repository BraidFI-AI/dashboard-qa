import ApiClient, { Method } from "../api/ApiClient";
import {
  AccountCard,
  CreateAcount,
  CreateIndividualDocument,
  CustomerAccount,
  CustomerSearch,
  Individual,
  IndividualDocument,
  IndividualExternalAccount,
} from "../api/ApiTypes";

class IndividualRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async unblockIndividual(id: number) {
    const individual = await this.apiClient.http(
      Method.POST,
      `individual/unblock/${id}`
    );

    return individual;
  }

  public async fetchIndividualsPaginated(
    pageSize: number,
    pageNumber: number,
    filters: CustomerSearch
  ) {
    return await this.apiClient.http<any>(
      Method.POST,
      `/individual/search?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      filters
    );
  }

  public async fetchIndividuals() {
    const response = await this.apiClient.http<any[]>(
      Method.GET,
      "/individual"
    );
    return response;
  }

  public async fetchIndividual(individualId: number) {
    const individual = await this.apiClient.http<Individual>(
      Method.GET,
      `/individual/${individualId}`
    );

    return individual;
  }

  public async fetchIndividualAccountsBalance(id: number) {
    const accounts = await this.apiClient.http<CustomerAccount[]>(
      Method.GET,
      `/individual/${id}/accounts`
    );

    return accounts;
  }

  public async fetchIndividualAccounts(
    id: number,
    pageSize: number,
    pageNumber: number
  ) {
    const accounts = await this.apiClient.http<{
      content: CustomerAccount[];
      number: number;
      totalElements: number;
      nextPage: boolean;
    }>(
      Method.GET,
      `/account?customerId=${id}&pageSize=${pageSize}&pageNumber=${pageNumber}`
    );

    return accounts;
  }

  public async fetchIndividualAccountCards(id: string) {
    const card = await this.apiClient.http<AccountCard>(
      Method.GET,
      `account/${id}/card`
    );

    return card;
  }
  public async createIndividual(form: CreateAcount) {
    await this.apiClient.http<CreateAcount>(
      Method.POST,
      "account/individual",
      form
    );
  }

  public async fetchIndividualIdsList() {
    const individuals = await this.apiClient.http<Individual[]>(
      Method.GET,
      `/individual`
    );

    const individualIds: string[] = [];
    individuals.map((individual: Individual) => {
      individualIds.push(individual.id.toString());
    });

    return individualIds;
  }

  public async createPaymentInstrument(
    id: string,
    paymentInstrument: IndividualExternalAccount
  ) {
    const resp = await this.apiClient.http<IndividualExternalAccount>(
      Method.POST,
      `/individual/${id}/paymentInstrument`,
      paymentInstrument
    );

    return resp;
  }

  public async createIndividualAccount(data: {
    individualId: string;
    accountName: string;
    accountType: string;
    fundingAccountNumber: string;
  }) {
    const resp = await this.apiClient.http<CreateAcount>(
      Method.POST,
      `account/individual/${data.individualId}`,
      {
        accountName: data.accountName,
        accountType: data.accountType,
        fundingAccountNumber: data.fundingAccountNumber,
      }
    );

    return resp;
  }

  public async fetchAllIndividualAccounts(id: string) {
    const allAccounts: CustomerAccount[] = [];
    let nextPage = true;
    let currentPage = 0;

    while (nextPage) {
      const accounts = await this.apiClient.http<{
        content: any[];
        number: number;
        totalElements: number;
        nextPage: boolean;
      }>(
        Method.GET,
        `/account?customerId=${id}&pageSize=${500}&pageNumber=${currentPage}`
      );

      allAccounts.push(...accounts.content);
      nextPage = accounts.nextPage;
    }

    console.log("accounts", allAccounts);
    return allAccounts;
  }

  public async fetchIndividualDocuments(id: number) {
    const documents = await this.apiClient.http<IndividualDocument[]>(
      Method.GET,
      `/individual/${id}/document`
    );

    return documents;
  }

  public async fetchIndividualDocumentUrl(id: number, documentId: number) {
    const url = await this.apiClient.http<IndividualDocument[]>(
      Method.GET,
      `/individual/${id}/document/${documentId}`
    );

    return url;
  }

  public async createIndividualDocument(
    id: string,
    data: CreateIndividualDocument
  ) {
    const document = await this.apiClient.http<IndividualDocument>(
      Method.POST,
      `/individual/${id}/document`,
      data
    );

    return document;
  }

  public async uploadIndividualDocument(
    businessId: string,
    documentId: string,
    file: any
  ) {
    const data = await this.apiClient.uploadFile(
      `/individual/${businessId}/document/${documentId}`,
      file
    );

    return data;
  }

  public async approveIndividual(id: number) {
    return await this.apiClient.http<any>(Method.PATCH, `/individual/${id}`, {
      status: "ACTIVE",
    });
  }

  public async updateIndividual(id: string, individual: Individual) {
    return await this.apiClient.http<any>(
      Method.PATCH,
      `/individual/${id}`,
      individual
    );
  }

  public async fetchCIPStatus(id: string) {
    return await this.apiClient.http<any>(
      Method.GET,
      `/identity-verification/${id}`
    );
  }
}

export default IndividualRepo;
