import ApiClient, { Method } from "../api/ApiClient";
import { Account, Business, Individual, OneTimeFees } from "../api/ApiTypes";

class AccountRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchAccounts() {
    const response = await this.apiClient.http<Account[]>(
      Method.GET,
      "/account"
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
      // `/account/${id}`,
      `/account/${id}/status`,
      { status: data.status }
    );
    return response;
  }

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

  public async fetchAccountNumbersList() {
    const accounts = await this.apiClient.http<Account[]>(
      Method.GET,
      `/account`
    );

    const accountIds: string[] = [];
    accounts.map((account: Account) => {
      if (account && account.id) {
        accountIds.push(account.accountNumber?.toString() ?? "");
      }
    });

    return accountIds;
  }

  public async fetchAccountIdsList() {
    const accounts = await this.apiClient.http<Account[]>(
      Method.GET,
      `/account`
    );

    const accountIds: string[] = [];
    accounts.map((account: Account) => {
      if (account && account.id) {
        accountIds.push(account.id.toString());
      }
    });

    return accountIds;
  }
}

export default AccountRepo;
