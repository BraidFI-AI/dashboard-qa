import ApiClient, { Method } from "../api/ApiClient";
import { Account, Business, Individual, OneTimeFees } from "../api/ApiTypes";

class AccountRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchAccounts(pageSize: number, pageNumber: number) {
    const response = await this.apiClient.http<any>(
      Method.GET,
      `/account?pageSize=${pageSize}&pageNumber=${pageNumber}`
    );
    return response;
  }

  public async chargeOneTimeFee(data: OneTimeFees) {
    const response = await this.apiClient.http(
      Method.POST,
      "/transaction/fee/onetime",
      data
    );
    return response;
  }

  public async fetchAccountBalance(id: string) {
    const response = await this.apiClient.http(
      Method.GET,
      `/account/${id}/balance`
    );
    return response;
  }

  public async fetchAccount(id: string) {
    const response = await this.apiClient.http<Account>(
      Method.GET,
      `/account/${id}`
    );
    return response;
  }

  public async updateAccountStatusDev(id: string, status: string) {
    const response = await this.apiClient.http<Account[]>(
      Method.PATCH,
      `/account/${id}/status`,
      { status: status }
    );
    return response;
  }

  public async updateAccount(
    id: string,
    data: {
      status: string;
      accountName?: string;
      canAcceptSweep?: string;
      fundingAccountNumber?: string;
      sweepAccountNumber?: string;
    }
  ) {
    const response = await this.apiClient.http<Account[]>(
      Method.PATCH,
      `/account/${id}`,
      { ...data }
    );
    return response;
  }

  /// down below to remove
  public async fetchIndividualOrBusiness(id: string) {
    try {
      const business = await this.apiClient.http<Business[]>(
        Method.GET,
        `/business/${id}`
      );
      return business;
    } catch (e: any) {
      if (e && e.response && e.response.status) {
        if (e?.response?.status == 404) {
          const indv = await this.apiClient.http<Individual[]>(
            Method.GET,
            `/individual/${id}`
          );
          return indv;
        }
      }
      console.log(e);
    }
  }

  public async fetchAccountNumbersList(pageSize: number, pageNumber: number) {
    const accounts = await this.apiClient.http<any>(
      Method.GET,
      `/account?pageSize=${pageSize}&pageNumber=${pageNumber}`
    );

    const accountIds: string[] = [];
    accounts.content.map((account: Account) => {
      if (account && account.id) {
        accountIds.push(account.accountNumber?.toString() ?? "");
      }
    });

    return {
      accountIds: accountIds,
      totalPages: accounts.totalPages,
      totalElements: accounts.totalElements,
      pageNumber: accounts.pageNumber,
      pageSize: accounts.pageSize,
    };
  }
}

export default AccountRepo;
