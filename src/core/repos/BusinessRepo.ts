import axios from "axios";
import ApiClient, { Method } from "../api/ApiClient";
import {
  Business,
  BusinessDocument,
  Individual,
  UBODetailed,
  BusinessKYC,
  CustomerAccount,
  AccountCard,
  Submission,
  CreateAcount,
  CreateBusinessDocument,
  CreateUBO,
  BusinessExternalAccount,
} from "../api/ApiTypes";
import { v4 as uuidv4 } from "uuid";
import { format } from "path";
import { Auth } from "aws-amplify";

class BusinessRepo {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  public async fetchUBOs(businessId: string) {
    const ubos = await this.apiClient.http<any>(
      Method.GET,
      `/business/${businessId}/ubo`
    );

    return ubos;
  }

  public async createUBO(
    ubo: CreateUBO,
    productId: number,
    businessId: number
  ) {
    const indvData = {
      firstName: ubo.firstName,
      lastName: ubo.lastName,
      email: ubo.email,
      productId: productId,
      ssn: ubo.ssn,
      dateOfBirth: ubo.dateOfBirth,
      idNumber: ubo.idNumber,
    };

    const indv = await this.apiClient.http<Individual>(
      Method.POST,
      `/individual`,
      indvData
    );

    const uboData = {
      businessId: businessId,
      customerId: indv.id,
      email: ubo.email,
      isControlPerson: true,
      ownership: ubo.ownership,
      title: ubo.title,
    };
    const res = await this.apiClient.http<Individual>(
      Method.POST,
      `/business/${businessId}/ubo`,
      uboData
    );

    return res;
  }

  public async createBusiness(business: Business) {
    // let location = "";
    // if (typeof window !== "undefined") {
    //   console.log("url:", window.location.href);
    //   location = window.location.href;
    // }

    // const url = location?.includes("prod.braid.zone")
    //   ? "https://api.prod.braid.zone"
    //   : `https://api.dev.braid.zone`;

    // const res = await axios.post(`${url}/business/initiate`, {
    //   productId: business.productId,
    //   customerToken: uuidv4(),
    // });

    // console.log(res);

    // const user = await Auth.currentAuthenticatedUser();

    const businessData = {
      name: business.name,
      dba: business.dba,
      achCompanyId: business.achCompanyId,
      incorporationState: business.incorporationState,
      businessEntityType: business.businessEntityType,
      businessIdType: business.businessIdType,
      idNumber: business.idNumber,
      formationDate: business.formationDate,
      website: business.website,
      address: business.address,
      mobilePhone: business.mobilePhone,
      submittedBy: business.submittedBy,
      ach: business.ach,
      email: business.submittedBy?.contactPersonEmail,
      productId: business.productId,
    };

    console.log("creating business:", businessData);

    const patch = await this.apiClient.http<any[]>(
      Method.POST,
      `/business`,
      businessData
    );

    return patch;
  }

  public async fetchBusinesses() {
    const response = await this.apiClient.http<any[]>(Method.GET, "/business");

    return response;
  }

  public async fetchBusiness(id: number) {
    const business = await this.apiClient.http<Business>(
      Method.GET,
      `/business/${id}`
    );

    return business;
  }

  public async fetchBusinessSubmission(id: number) {
    const submission = await this.apiClient.http<Submission>(
      Method.GET,
      `/questionset/latestSubmission/${id}`
    );

    return submission;
  }

  public async fetchBusinessAccounts(id: number) {
    const accounts = await this.apiClient.http<CustomerAccount[]>(
      Method.GET,
      `/business/${id}/accounts`
    );

    return accounts;
  }

  public async fetchBusinessAccountIds(id: string) {
    const accounts = await this.apiClient.http<CustomerAccount[]>(
      Method.GET,
      `/business/${id}/accounts`
    );

    let idsList: string[] = [];

    accounts.forEach((acc: CustomerAccount) => {
      idsList.push(acc.id);
    });

    return idsList;
  }

  public async fetchBusinessAccountNumbers(id: string) {
    const accounts = await this.apiClient.http<CustomerAccount[]>(
      Method.GET,
      `/business/${id}/accounts`
    );

    let idsList: string[] = [];

    accounts.forEach((acc: CustomerAccount) => {
      idsList.push(acc.accountNumber);
    });

    return idsList;
  }

  public async fetchBusinessKYC(id: number) {
    const data = await this.apiClient.http<BusinessKYC>(
      Method.GET,
      `/identity/business/${id}`
    );

    return data;
  }

  public async fetchUBOKYC(id: number, uboId: number) {
    try {
      const data = await this.apiClient.http<BusinessKYC>(
        Method.GET,
        `/business/${id}/ubo/${uboId}/KYC`
      );

      return data;
    } catch (e) {
      return { id: -1, customerId: -1 };
    }
  }

  public async unblockBuisness(businessId: number) {
    const business = await this.apiClient.http(
      Method.POST,
      `business/unblock/${businessId}`
    );

    return business;
  }

  public async fetchUBODetails(businessId: number, id: number) {
    const ubo = await this.apiClient.http<UBODetailed>(
      Method.GET,
      `business/${businessId}/ubo/${id}`
    );

    return ubo;
  }

  public async fetchBusinessAccountCards(id: string) {
    const card = await this.apiClient.http<AccountCard>(
      Method.GET,
      `/card/${id}/card`
    );

    return card;
  }

  public async fetchUBOIndividualDetails(id: number) {
    const business = await this.apiClient.http<Individual>(
      Method.GET,
      `/individual/${id}`
    );
    if (business.type !== "INDIVIDUAL") {
      throw Error("Invalid Individual Customer ID");
    }

    return business;
  }

  public async fetchBusinessDocuments(id: number) {
    const documents = await this.apiClient.http<BusinessDocument[]>(
      Method.GET,
      `/business/${id}/document`
    );

    return documents;
  }

  public async createBusinessDocument(
    id: string,
    data: CreateBusinessDocument
  ) {
    const document = await this.apiClient.http<BusinessDocument>(
      Method.POST,
      `/business/${id}/document`,
      data
    );

    return document;
  }

  public async downloadBusinessPdf(id: string, filename: string) {
    const url: string | null = await this.apiClient.http(
      Method.GET,
      `/business/${id}/detailsPdf`
    );

    if (url) {
      this.apiClient.downloadBusinessPdf(url, filename);
      return url;
    }

    return null;
  }

  public async uploadBusinessDocument(
    businessId: string,
    documentId: string,
    file: any
  ) {
    const data = await this.apiClient.uploadFile(
      `/business/${businessId}/document/${documentId}`,
      file
    );

    return data;
  }

  public async fetchBusinessDocumentUrl(id: number, documentId: number) {
    const url = await this.apiClient.http<BusinessDocument[]>(
      Method.GET,
      `/business/${id}/document/${documentId}`
    );

    return url;
  }

  public async approveBusiness(id: number, dateTime: string) {
    await this.apiClient.http<BusinessDocument[]>(
      Method.PATCH,
      `/business/${id}`,
      { customerVerified: dateTime, status: "ACTIVE" }
    );
  }

  public async fetchBusinessIdsList() {
    const businesses = await this.apiClient.http<Business[]>(
      Method.GET,
      `/business`
    );

    const businessIds: string[] = [];
    businesses.map((business: Business) => {
      businessIds.push(business.id?.toString() ?? "");
    });

    return businessIds;
  }

  public async creatBusinessAccount(data: {
    businessId: string;
    accountName: string;
    accountType: string;
    fundingAccountNumber: string;
  }) {
    const resp = await this.apiClient.http<CreateAcount>(
      Method.POST,
      `account/business/${data.businessId}`,
      {
        accountName: data.accountName,
        accountType: data.accountType,
        fundingAccountNumber: data.fundingAccountNumber,
      }
    );

    return resp;
  }

  public async createPaymentInstrument(
    id: string,
    paymentInstrument: BusinessExternalAccount
  ) {
    const resp = await this.apiClient.http<BusinessExternalAccount>(
      Method.POST,
      `/business/${id}/paymentInstrument`,
      paymentInstrument
    );

    return resp;
  }

  public async deletePaymentInstrument(id: string) {
    const resp = await this.apiClient.http<BusinessExternalAccount>(
      Method.DELETE,
      `/business/${id}/paymentInstrument`
    );

    return resp;
  }
}

export default BusinessRepo;
