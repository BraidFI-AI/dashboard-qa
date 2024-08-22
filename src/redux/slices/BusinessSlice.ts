import ApiClient from "@/core/api/ApiClient";
import {
  AccountCard,
  Business,
  CustomerAccount,
  BusinessDocument,
  BusinessDocumentWithLink,
  Individual,
  UBODetailed,
  CreateAcount,
  CreateBusinessDocument,
  Counterparty,
  IdsListType,
  CreateUBO,
  BusinessExternalAccount,
} from "@/core/api/ApiTypes";
import {
  APP_TIMEZONE,
  PaginationStateType,
  paginationPageSize,
} from "@/core/constants";
import BusinessRepo from "@/core/repos/BusinessRepo";
import CounterpartyRepo from "@/core/repos/CounterpartyRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { error } from "console";
import moment from "moment";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const businessRepo: BusinessRepo = new BusinessRepo(apiClient);
const counterpartyRepo: CounterpartyRepo = new CounterpartyRepo(apiClient);

export type BusinessCounterpartyType = "loading" | string | Counterparty[];
export type BusinessAccountIdsType = "loading" | string | string[];

interface BusinessState {
  businesses: Business[] | null;
  counterparties: BusinessCounterpartyType;
  accountIds: BusinessAccountIdsType;
  counterpartyPagination: PaginationStateType;
  refresh: boolean;
  business: "loading" | string | Business;
}

const initialState: BusinessState = {
  businesses: null,
  counterparties: "loading",
  accountIds: "loading",
  business: "loading",
  counterpartyPagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
  },
  refresh: true,
};

const BusinessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setInitialBusinessState(state) {
      Object.assign(state, initialState);
    },
    setBusinessCounterpartyPaginationPageNumber(state, action) {
      state.counterpartyPagination.pageNumber = action.payload;
    },
    setRefresh(state, action) {
      state.refresh = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBusinessV2.pending, (state, action) => {
      state.business = "loading";
    });
    builder.addCase(fetchBusinessV2.fulfilled, (state, action) => {
      state.business = action.payload;
    });
    builder.addCase(fetchBusinesses.fulfilled, (state, action) => {
      state.businesses = action.payload;
    });
    builder.addCase(fetchBusinessCounterparties.pending, (state, action) => {
      if (state.counterpartyPagination.pageNumber == -1) {
        state.counterparties = "loading";
      }
      state.counterpartyPagination.loadingPage = true;
    });
    builder.addCase(fetchBusinessCounterparties.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.counterparties = action.payload;
      } else {
        state.counterparties = action.payload.counterparties;
        state.counterpartyPagination.rowCount = action.payload.rowCount;
        state.counterpartyPagination.pageNumber = action.payload.pageNumber;
      }

      state.counterpartyPagination.loadingPage = false;
    });
    //========================== accounts
    builder.addCase(fetchBusinessAccountIds.pending, (state, action) => {
      state.accountIds = "loading";
    });
    builder.addCase(fetchBusinessAccountIds.fulfilled, (state, action) => {
      state.accountIds = action.payload;
    });
    builder.addCase(fetchBusinessAccountNumbers.pending, (state, action) => {
      state.accountIds = "loading";
    });
    builder.addCase(fetchBusinessAccountNumbers.fulfilled, (state, action) => {
      state.accountIds = action.payload;
    });
    //========================== accounts END
  },
});

export const createBusiness = createAsyncThunk(
  "business/createBusiness",
  async (business: Business) => {
    try {
      const acc = await businessRepo.createBusiness(business);

      console.log("Business created:", acc);

      return acc;
    } catch (e: any) {
      return `Error creating business ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchUBOs = createAsyncThunk(
  "business/fetchUBOs",
  async (id: string) => {
    try {
      const acc = await businessRepo.fetchUBOs(id);

      console.log("ubos:", acc);

      return acc;
    } catch (e: any) {
      return `Error fetching ubos ${generateErrorMessage(e)}`;
    }
  }
);

export const createUBO = createAsyncThunk(
  "business/createUBO",
  async (data: { ubo: CreateUBO; productId: number; businessId: number }) => {
    try {
      const acc = await businessRepo.createUBO(
        data.ubo,
        data.productId,
        data.businessId
      );

      console.log("Business created:", acc);

      return acc;
    } catch (e: any) {
      return `Error creating ubo ${generateErrorMessage(e)}`;
    }
  }
);

// ========================== accounts

export const fetchBusinessAccountsV2 = createAsyncThunk(
  "business/fetchBusinessAccounts",
  async (id: number) => {
    try {
      const accounts = await businessRepo.fetchBusinessAccounts(id);

      const accountsBalance = await businessRepo.fetchBusinessAccountsBalance(
        id
      );

      console.log("accounts", accounts);
      console.log("accounts balance", accountsBalance);

      let combined = [];

      for (let i = 0; i < accounts.length; i++) {
        combined.push({
          ...accounts[i],
          active: accountsBalance.find(
            (acc) => acc.accountNumber == accounts[i].accountNumber
          )?.active,
          frozen: accountsBalance.find(
            (acc) => acc.accountNumber == accounts[i].accountNumber
          )?.frozen,
          balance: {
            accountBalance: accountsBalance.find(
              (acc) => acc.accountNumber == accounts[i].accountNumber
            )?.balance?.accountBalance,
            availableBalance: accountsBalance.find(
              (acc) => acc.accountNumber == accounts[i].accountNumber
            )?.balance?.availableBalance,
          },
        });
      }

      return combined;
    } catch (e: any) {
      return `Error fetching accounts ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchBusinessAccounts = createAsyncThunk(
  "business/fetchBusinessAccounts",
  async (id: number) => {
    try {
      const accounts = await businessRepo.fetchBusinessAccounts(id);
      console.log("accounts", accounts);
      return accounts;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching accounts ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchBusinessAccountIds = createAsyncThunk(
  "business/fetchBusinessAccountIds",
  async (id: string) => {
    try {
      const ids = await businessRepo.fetchBusinessAccountIds(id);
      console.log("account ids", ids);
      if (ids.length == 0) {
        return "No accounts found";
      } else {
        return ids;
      }
    } catch (e: any) {
      return `Error fetching accounts ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchBusinessAccountNumbers = createAsyncThunk(
  "business/fetchBusinessAccountNumbers",
  async (id: string) => {
    try {
      const ids = await businessRepo.fetchBusinessAccountNumbers(id);
      console.log("account ids", ids);
      if (ids.length == 0) {
        return "No accounts found";
      } else {
        return ids;
      }
    } catch (e: any) {
      return `Error fetching accounts ${generateErrorMessage(e)}`;
    }
  }
);
// ========================== accounts END

// ========================== counterparties

export const fetchBusinessCounterparties = createAsyncThunk(
  "business/fetchBusinessCounterparties",
  async (data: { id: string; refresh?: boolean }, thunkApi: any) => {
    try {
      const counterparties = await counterpartyRepo.fetchCounterparties(
        data.id,
        paginationPageSize,
        data.refresh != null && data.refresh == true
          ? 0
          : thunkApi.getState().business.counterpartyPagination.pageNumber == -1
          ? 0
          : thunkApi.getState().business.counterpartyPagination.pageNumber
      );
      console.log("Business counterparties", counterparties);
      return {
        counterparties: counterparties.content,
        rowCount: counterparties.totalElements,
        pageNumber: counterparties.number,
      };
    } catch (e: any) {
      return `Error fetching counterparties ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchBusinessAccountCounterpartiesIds = createAsyncThunk(
  "business/fetchBusinessAccountCounterpartiesIds",
  async (id: string) => {
    try {
      var pageNumber: number = 0;

      const counterparties: IdsListType[] = [];
      var data = await counterpartyRepo.fetchCounterpartyIds(
        id,
        500,
        pageNumber
      );

      counterparties.push(...data.ids);

      while (data.next == true) {
        data = await counterpartyRepo.fetchCounterpartyIds(id, 500, pageNumber);
        counterparties.push(...data.ids);
      }

      console.log("Individual account counterparties ids", counterparties);

      if (counterparties.length == 0) {
        return "No counterparties found";
      } else {
        return counterparties;
      }
    } catch (e: any) {
      return `Error fetching counterparties ${generateErrorMessage(e)}`;
    }
  }
);

// ========================== counterparties END

export const unblockBusiness = createAsyncThunk(
  "business/unblockBusiness",
  async (id: number) => {
    try {
      const business = await businessRepo.unblockBuisness(id);
      console.log("Business unblocked", business);
      return business;
    } catch (e: any) {
      return `Error unblocking business ${generateErrorMessage(e)}`;
    }
  }
);

export const approveBusiness = createAsyncThunk(
  "business/approveBusiness",
  async (id: number) => {
    try {
      await businessRepo.approveBusiness(id);

      enqueueSnackbar("Business approved!", { variant: "success" });
    } catch (e: any) {
      if (e.response?.status == 404) {
        return null;
      } else {
        enqueueSnackbar(`Error approving business ${generateErrorMessage(e)}`, {
          variant: "error",
          persist: true,
        });
      }
    }

    return null;
  }
);

export const fetchBusinessSubmission = createAsyncThunk(
  "business/fetchBusinessSubmission",
  async (id: number) => {
    try {
      const submission = await businessRepo.fetchBusinessSubmission(id);
      console.log("submission", submission);
      return submission;
    } catch (e: any) {
      if (e.response?.status == 404) {
        return null;
      } else {
        enqueueSnackbar(
          `Error fetching submission ${generateErrorMessage(e)}`,
          {
            variant: "error",
            persist: true,
          }
        );
      }
    }

    return null;
  }
);

export const fetchUboKycStatus = createAsyncThunk(
  "business/fetchUboKycStatus",
  async (business: Business) => {
    try {
      // get ubo details of all ubos to get the customer id
      const uboDetailsAPI: any = [];
      const uboDetails: UBODetailed[] = [];
      business.ubos?.forEach((ubo) => {
        uboDetailsAPI.push(
          businessRepo.fetchUBODetails(business.id ?? -1, ubo.id)
        );
      });

      const data = await Promise.all(uboDetailsAPI);
      data.forEach((ubo: UBODetailed) => {
        uboDetails.push(ubo);
      });

      // get the individual details using the customer id retrieved above to get kyc status
      const uboIndvDetailsAPI: any = [];
      const uboIndvDetails: Individual[] = [];
      uboDetails.forEach((ubo: UBODetailed) => {
        uboIndvDetailsAPI.push(
          businessRepo.fetchUBOIndividualDetails(ubo.customerId)
        );
      });

      const IndvData = await Promise.all(uboIndvDetailsAPI);
      IndvData.forEach((indv: Individual) => {
        uboIndvDetails.push(indv);
      });

      const kycDataAPI: any = [];
      IndvData.forEach((indv: Individual, index: number) => {
        kycDataAPI.push(
          businessRepo.fetchUBOKYC(business.id ?? -1, uboDetails[index].id)
        );
      });

      const kycData = await Promise.all(kycDataAPI);
      console.log(kycData);

      console.log("ubo details", IndvData, "kyc dets", kycData);

      return { details: IndvData, kyc: kycData };
    } catch (e: any) {
      enqueueSnackbar(`Error fetching ubo kyc ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
      return null;
    }
  }
);

export const fetchBusinessAccountsCards = createAsyncThunk(
  "business/fetchBusinessAccountsCards",
  async (business: Business) => {
    try {
      const accounts: CustomerAccount[] =
        await businessRepo.fetchBusinessAccounts(business.id ?? -1);

      const accountCardApis: any = [];
      const cards: AccountCard[] = [];

      accounts.forEach((account: CustomerAccount) => {
        accountCardApis.push(
          businessRepo.fetchBusinessAccountCards(account.accountNumber)
        );
      });

      const data = await Promise.all(accountCardApis);
      data.forEach((card: AccountCard) => {
        cards.push(card);
      });

      return cards;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching cards ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const downloadBusinessPdf = createAsyncThunk(
  "business/downloadBusinessPdf",
  async (data: { id: string; filename: string }) => {
    try {
      return await businessRepo.downloadBusinessPdf(data.id, data.filename);
    } catch (e) {
      return null;
    }

    return null;
  }
);

export const unblockBusinessCounterparty = createAsyncThunk(
  "business/unblockBusinessCounterparty",
  async (id: number) => {
    try {
      const counterparty = await counterpartyRepo.unblockCounterparty(id);
      console.log("counterparty unblocked", counterparty);
      return counterparty;
    } catch (e: any) {
      return `Error updating counterparty ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchBusinesses = createAsyncThunk(
  "business/fetchBusinesses",
  async () => {
    try {
      const businesses = await businessRepo.fetchBusinesses();
      console.log("businesses", businesses);
      return businesses;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching businesses ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchBusinessV2 = createAsyncThunk(
  "business/fetchBusiness",
  async (id: number) => {
    try {
      const business = await businessRepo.fetchBusiness(id);
      console.log("business", business);
      return business;
    } catch (e: any) {
      return `Error fetching business ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchBusiness = createAsyncThunk(
  "business/fetchBusiness",
  async (id: number) => {
    try {
      const business = await businessRepo.fetchBusiness(id);
      console.log("business", business);
      return business;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching business ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
      return null;
    }
  }
);

export const fetchUploadedBusinessDocuments = createAsyncThunk(
  "business/fetchUploadedBusinessDocuments",
  async (id: string) => {
    try {
      const docs = await businessRepo.fetchBusinessDocuments(parseInt(id));
      return docs;
    } catch (e: any) {
      // enqueueSnackbar(`Error: ${e.message}`, { variant: "error" });
      return null;
    }
  }
);

export const createBusinessDocument = createAsyncThunk(
  "business/fetchUploadedBusinessDocuments",
  async (data: { id: string; data: CreateBusinessDocument }) => {
    try {
      const doc = await businessRepo.createBusinessDocument(data.id, data.data);

      console.log("document created:", doc);
      return doc;
    } catch (e: any) {
      // enqueueSnackbar(`Error: ${e.message}`, { variant: "error" });
      enqueueSnackbar(`Error creating document ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
      return null;
    }
  }
);

export const uploadBusinessDocument = createAsyncThunk(
  "business/uploadBusinessDocument",
  async (data: { businessId: string; documentId: string; file: File }) => {
    try {
      const doc = await businessRepo.uploadBusinessDocument(
        data.businessId,
        data.documentId,
        { file: data.file }
      );
      console.log("document uploaded:", doc);
      return doc;
    } catch (e: any) {
      // enqueueSnackbar(`Error: ${e.message}`, { variant: "error" });
      enqueueSnackbar(`Error uploading document ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
      return null;
    }
  }
);

export const fetchBusinessDocuments = createAsyncThunk(
  "business/fetchBusinessDocuments",
  async (id: number) => {
    try {
      const documents: BusinessDocument[] =
        await businessRepo.fetchBusinessDocuments(id);

      const docs: BusinessDocumentWithLink[] = [];

      if (documents.length > 0) {
        documents.forEach((document: any, index: number) => {
          docs.push({
            document: document,
            link:
              document.documentUrl == null ? "No Doc" : document.documentUrl,
          });
        });
        return docs;

        // const urls: any[] = [];
        // documents.forEach((document: BusinessDocument) => {
        //   if (document.status !== "REQUIRED") {
        //     urls.push(businessRepo.fetchBusinessDocumentUrl(id, document.id));
        //   } else {
        //     urls.push("No Doc");
        //   }
        // });
        // // for (let i = 0; i < documents.length; i++) {
        // //   if (documents[i].status !== "REQUIRED") {
        // //     urls.push(
        // //       businessRepo.fetchBusinessDocumentUrl(id, documents[i].id)
        // //     );
        // //   } else {
        // //     urls.push("No Doc");
        // //   }
        // // }

        // try {
        //   const data: any = await Promise.all(urls);
        //   const docs: BusinessDocumentWithLink[] = [];

        //   documents.forEach((document: any, index: number) => {
        //     docs.push({ document: document, link: data[String(index)] });
        //   });

        //   // for (let i = 0; i < documents.length; i++) {
        //   //   docs.push({ document: documents[i], link: data[i] });
        //   // }

        // } catch (e: any) {
        //   enqueueSnackbar(`Error (Document Link): ${e.message}`, {
        //     variant: "error",
        //   });
        // }
      } else {
        return [];
      }
    } catch (e: any) {
      enqueueSnackbar(`Error fetching documents ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchBusinessDocumentUrl = createAsyncThunk(
  "business/fetchBusinessDocumentUrl",
  async (data: { businessId: number; documentId: number }) => {
    try {
      const url = await businessRepo.fetchBusinessDocumentUrl(
        data.businessId,
        data.documentId
      );
      return url;
    } catch (e: any) {
      enqueueSnackbar(
        `Error fetching document url ${generateErrorMessage(e)}`,
        {
          variant: "error",
          persist: true,
        }
      );
    }

    return null;
  }
);

export const fetchBusinessIdsList = createAsyncThunk(
  "business/fetchBusinessIdsList",
  async () => {
    try {
      const businessIds = await businessRepo.fetchBusinessIdsList();
      return businessIds;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching businesses ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const creatBusinessAccount = createAsyncThunk(
  "account/business",
  async (data: {
    businessId: string;
    accountName: string;
    accountType: string;
    fundingAccountNumber: string;
  }) => {
    try {
      const acc = await businessRepo.creatBusinessAccount(data);

      console.log("Business account created:", acc);

      return acc;
    } catch (e: any) {
      return `Error creating business account ${generateErrorMessage(e)}`;
    }
  }
);

export const createPaymentInstrument = createAsyncThunk(
  "business/createPaymentInstrument",
  async (data: { id: string; paymentInstrument: BusinessExternalAccount }) => {
    try {
      const inst = await businessRepo.createPaymentInstrument(
        data.id,
        data.paymentInstrument
      );
      return inst;
    } catch (e: any) {
      return `Error creating payment instrument ${generateErrorMessage(e)}`;
    }
  }
);

export const deletePaymentInstrument = createAsyncThunk(
  "business/deletePaymentInstrument",
  async (id: string) => {
    try {
      const inst = await businessRepo.deletePaymentInstrument(id);
      return inst;
    } catch (e: any) {
      return `Error deleting payment instrument ${generateErrorMessage(e)}`;
    }
  }
);

export const updateBusiness = createAsyncThunk(
  "individual/updateBusiness",
  async (data: { id: string; status: string; cipStatus: string }) => {
    try {
      return await businessRepo.updateBusiness(data.id, {
        status: data.status,
        cipStatus: data.cipStatus,
      });
    } catch (e: any) {
      return `Error updating Business ${generateErrorMessage(e)}`;
    }
  }
);

export default BusinessSlice;
export const {
  setInitialBusinessState,
  setBusinessCounterpartyPaginationPageNumber,
  setRefresh,
} = BusinessSlice.actions;
