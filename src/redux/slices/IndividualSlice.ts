import ApiClient from "@/core/api/ApiClient";
import {
  AccountCard,
  Counterparty,
  CreateAcount,
  CreateIndividualDocument,
  CustomerAccount,
  CustomerSearch,
  IdsListType,
  Individual,
  IndividualDocument,
  IndividualDocumentWithLink,
  IndividualExternalAccount,
  RulesAndLimits,
} from "@/core/api/ApiTypes";
import { PaginationStateType, paginationPageSize } from "@/core/constants";
import CounterpartyRepo from "@/core/repos/CounterpartyRepo";
import IndividualRepo from "@/core/repos/IndividualRepo";
import RulesAndLimitsRepo from "@/core/repos/RulesAndLimitsRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";
import { LimitsType } from "./RulesAndLimitsSlice";
import { count } from "d3";
import moment from "moment";

const apiClient = ApiClient.getInstance();
const individualRepo: IndividualRepo = new IndividualRepo(apiClient);
const counterpartyRepo: CounterpartyRepo = new CounterpartyRepo(apiClient);

export type IndividualCounterpartyType = "loading" | string | Counterparty[];
export type IndividualAccountIdsType = "loading" | string | string[];

interface IndividualState {
  individuals: Individual[] | null;
  individualsPaginated: "loading" | string | Individual[];
  counterparties: IndividualCounterpartyType;
  accountIds: IndividualAccountIdsType;
  counterpartyPagination: PaginationStateType;
  refresh: boolean;
  individual: "loading" | string | Individual;
  individualAccounts: "loading" | string | CustomerAccount[];
  individualsPagination: PaginationStateType;
  individualAccountsPagination: PaginationStateType;
}

const initialState: IndividualState = {
  individuals: null,
  individualsPaginated: "loading",
  counterparties: "loading",
  accountIds: "loading",
  refresh: true,
  individual: "loading",
  individualAccounts: "loading",
  individualsPagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
    pageSize: paginationPageSize,
  },
  individualAccountsPagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
  },
  counterpartyPagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
  },
};

const IndividualSlice = createSlice({
  name: "individual",
  initialState,
  reducers: {
    setInitialIndividualState(state) {
      Object.assign(state, initialState);
    },
    setIndividualCounterpartyPaginationPageNumber(state, action) {
      state.counterpartyPagination.pageNumber = action.payload;
    },
    setRefreshIndividual(state, action) {
      state.refresh = action.payload;
    },
    setIndividualsPageSize(state, action) {
      state.individualsPagination.pageSize = action.payload;
    },
    setIndividualsPageNumber(state, action) {
      state.individualsPagination.pageNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIndividualsPaginated.pending, (state, action) => {
      if (
        state.individualsPagination.pageNumber == -1 ||
        action.meta.arg.refresh
      ) {
        state.individualsPaginated = "loading";
      }
      state.individualsPagination.loadingPage = true;
    });
    builder.addCase(fetchIndividualsPaginated.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.individualsPaginated = action.payload;
      } else {
        state.individualsPaginated = action.payload.individuals;
        state.individualsPagination.rowCount = action.payload.rowCount;
        state.individualsPagination.pageNumber = action.payload.pageNumber;
      }

      state.individualsPagination.loadingPage = false;
    });
    builder.addCase(fetchIndividualV2.pending, (state, action) => {
      state.individual = "loading";
    });
    builder.addCase(fetchIndividualV2.fulfilled, (state, action) => {
      state.individual = action.payload;
    });
    builder.addCase(fetchIndividual.pending, (state, action) => {
      state.individual = "loading";
    });
    builder.addCase(fetchIndividual.fulfilled, (state, action) => {
      if (action.payload != null) {
        state.individual = action.payload;
      }
    });
    builder.addCase(fetchIndividuals.fulfilled, (state, action) => {
      state.individuals = action.payload;
    });
    builder.addCase(fetchIndividualCounterparties.pending, (state, action) => {
      if (state.counterpartyPagination.pageNumber == -1) {
        state.counterparties = "loading";
      }
      state.counterpartyPagination.loadingPage = true;
    });
    builder.addCase(
      fetchIndividualCounterparties.fulfilled,
      (state, action) => {
        if (typeof action.payload == "string") {
          state.counterparties = action.payload;
        } else {
          state.counterparties = action.payload.counterparties;
          state.counterpartyPagination.rowCount = action.payload.rowCount;
          state.counterpartyPagination.pageNumber = action.payload.pageNumber;
        }

        state.counterpartyPagination.loadingPage = false;
      }
    );
    builder.addCase(fetchIndividualAccounts.pending, (state, action) => {
      if (
        state.individualAccountsPagination.pageNumber == -1 ||
        action.meta.arg.refresh == true
      ) {
        state.individualAccounts = "loading";
      }
      state.individualAccountsPagination.loadingPage = true;
    });
    builder.addCase(fetchIndividualAccounts.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.individualAccounts = action.payload;
      } else {
        state.individualAccounts = action.payload.accounts;
        state.individualAccountsPagination.rowCount = action.payload.rowCount;
        state.individualAccountsPagination.pageNumber =
          action.payload.pageNumber;
      }

      state.individualAccountsPagination.loadingPage = false;
    });
    builder.addCase(fetchAllIndividualAccounts.pending, (state, action) => {
      state.accountIds = "loading";
    });
    builder.addCase(fetchAllIndividualAccounts.fulfilled, (state, action) => {
      if (typeof action.payload != "string") {
        let idsList: string[] = [];

        action.payload.forEach((acc: CustomerAccount) => {
          idsList.push(acc.accountNumber);
        });

        state.accountIds = idsList;
      } else {
        state.accountIds = action.payload;
      }
    });
  },
});

export const unblockIndividual = createAsyncThunk(
  "individual/unblockIndividual",
  async (id: number) => {
    try {
      const indv = await individualRepo.unblockIndividual(id);
      console.log("Individual unblocked", indv);
      return indv;
    } catch (e: any) {
      return `Error unblocking individual ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchIndividualCounterparties = createAsyncThunk(
  "individual/fetchIndividualCounterparties",
  async (data: { id: string; refresh?: boolean }, thunkApi: any) => {
    try {
      const counterparties = await counterpartyRepo.fetchCounterparties(
        {
          individualId: data.id,
        },
        paginationPageSize,
        data.refresh != null && data.refresh == true
          ? 0
          : thunkApi.getState().individual.counterpartyPagination.pageNumber ==
            -1
          ? 0
          : thunkApi.getState().individual.counterpartyPagination.pageNumber
      );
      console.log("Individual counterparties", counterparties);
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

export const createPaymentInstrument = createAsyncThunk(
  "individual/createPaymentInstrument",
  async (data: {
    id: string;
    paymentInstrument: IndividualExternalAccount;
  }) => {
    try {
      const inst = await individualRepo.createPaymentInstrument(
        data.id,
        data.paymentInstrument
      );
      return inst;
    } catch (e: any) {
      return `Error creating payment instrument ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchIndividualsPaginated = createAsyncThunk(
  "individual/fetchIndividualsPaginated",
  async (
    data: { refresh: boolean; filters: CustomerSearch },
    thunkApi: any
  ) => {
    try {
      if (data.filters.createdAtStart) {
        const sDate = moment(data.filters.createdAtStart);
        data.filters = {
          ...data.filters,
          createdAtStart: `${sDate.year()}-${(sDate.month() + 1)
            .toString()
            .padStart(2, "0")}-${sDate.date().toString().padStart(2, "0")}`,
        };
      }
      if (data.filters.createdAtEnd) {
        const sDate = moment(data.filters.createdAtEnd);
        data.filters = {
          ...data.filters,
          createdAtEnd: `${sDate.year()}-${(sDate.month() + 1)
            .toString()
            .padStart(2, "0")}-${sDate.date().toString().padStart(2, "0")}`,
        };
      }

      const individuals = await individualRepo.fetchIndividualsPaginated(
        thunkApi.getState().individual.individualsPagination.pageSize ??
          paginationPageSize,
        data.refresh == true
          ? 0
          : thunkApi.getState().individual.individualsPagination.pageNumber ==
            -1
          ? 0
          : thunkApi.getState().individual.individualsPagination.pageNumber,
        data.filters
      );
      console.log("individuals", individuals);

      return {
        individuals: individuals.content,
        rowCount: individuals.totalElements,
        pageNumber: individuals.number,
      };
    } catch (e: any) {
      return `Error fetching businesses ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchIndividuals = createAsyncThunk(
  "individual/fetchIndividuals",
  async () => {
    try {
      const individuals = await individualRepo.fetchIndividuals();
      console.log("individuals", individuals);
      return individuals;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching individuals ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchIndividualV2 = createAsyncThunk(
  "individual/fetchIndividualV2",
  async (individualId: number) => {
    try {
      const individual = await individualRepo.fetchIndividual(individualId);
      console.log("individual", individual);
      return individual;
    } catch (e: any) {
      return `Error fetching individual ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchIndividual = createAsyncThunk(
  "individual/fetchIndividual",
  async (individualId: number) => {
    try {
      const individual = await individualRepo.fetchIndividual(individualId);
      console.log("individual", individual);
      return individual;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching individual ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

// leaving the following code here to have as a starting point for future use

// export const fetchIndividualAccountsCards = createAsyncThunk(
//   "individual/fetchIndividualAccountsCards",
//   async (individual: Individual) => {
//     try {
//       const accounts: CustomerAccount[] =
//         await individualRepo.fetchIndividualAccounts(individual.id);

//       const accountCardApis: any = [];
//       const cards: AccountCard[] = [];

//       accounts.forEach((account: CustomerAccount) => {
//         accountCardApis.push(
//           individualRepo.fetchIndividualAccountCards(account.id)
//         );
//       });

//       const data = await Promise.all(accountCardApis);
//       data.forEach((card: AccountCard) => {
//         cards.push(card);
//       });

//       return cards;
//     } catch (e: any) {
//       enqueueSnackbar(`Error fetching cards ${generateErrorMessage(e)}`, {
//         variant: "error",
//         persist: true,
//       });
//     }

//     return null;
//   }
// );

export const createIndividual = createAsyncThunk(
  "account/individual",
  async (form: CreateAcount) => {
    try {
      await individualRepo.createIndividual(form);
    } catch (e: any) {
      enqueueSnackbar(`Error creating individual ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchIndividualIdsList = createAsyncThunk(
  "individual/fetchIndividualIdsList",
  async () => {
    try {
      const individualIds = await individualRepo.fetchIndividualIdsList();
      return individualIds;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching individuals ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchIndividualAccounts = createAsyncThunk(
  "individual/fetchBusinessAccounts",
  async (data: { id: number; refresh: boolean }, thunkApi: any) => {
    try {
      const accounts = await individualRepo.fetchIndividualAccounts(
        data.id,
        paginationPageSize,
        thunkApi.getState().business.businessAccountsPagination.pageNumber ==
          -1 || data.refresh == true
          ? 0
          : thunkApi.getState().business.businessAccountsPagination.pageNumber
      );
      const accountsBalance =
        await individualRepo.fetchIndividualAccountsBalance(data.id);

      console.log("accounts", accounts);
      console.log("accounts balance", accountsBalance);
      let combined = [];

      for (let i = 0; i < accounts.content.length; i++) {
        combined.push({
          ...accounts.content[i],
          active: accountsBalance.find(
            (acc) => acc.accountNumber == accounts.content[i].accountNumber
          )?.active,
          frozen: accountsBalance.find(
            (acc) => acc.accountNumber == accounts.content[i].accountNumber
          )?.frozen,
          balance: {
            accountBalance:
              accountsBalance.find(
                (acc) => acc.accountNumber == accounts.content[i].accountNumber
              )?.balance?.accountBalance ?? "",
            availableBalance:
              accountsBalance.find(
                (acc) => acc.accountNumber == accounts.content[i].accountNumber
              )?.balance?.availableBalance ?? "",
          },
        });
      }

      return {
        accounts: combined,
        rowCount: accounts.totalElements,
        pageNumber: accounts.number,
      };
    } catch (e: any) {
      return `Error fetching accounts ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchAllIndividualAccounts = createAsyncThunk(
  "business/fetchAllIndividualAccounts",
  async (id: string) => {
    try {
      const accounts = await individualRepo.fetchAllIndividualAccounts(id);

      console.log("accounts", accounts);
      return accounts;
    } catch (e: any) {
      return `Error fetching accounts ${generateErrorMessage(e)}`;
    }
  }
);

export const createIndividualAccount = createAsyncThunk(
  "account/business",
  async (data: {
    individualId: string;
    accountName: string;
    accountType: string;
    fundingAccountNumber: string;
  }) => {
    try {
      const acc = await individualRepo.createIndividualAccount(data);

      console.log("Individual account created:", acc);

      return acc;
    } catch (e: any) {
      return `Error creating Individual account ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchIndividualAccountCounterpartiesIds = createAsyncThunk(
  "business/fetchIndividualAccountCounterpartiesIds",
  async (id: string) => {
    try {
      var pageNumber: number = 0;

      const counterparties: IdsListType[] = [];
      var data = await counterpartyRepo.fetchCounterpartyIds(
        {
          businessId: id,
        },
        500,
        pageNumber
      );

      counterparties.push(...data.ids);

      while (data.next == true) {
        data = await counterpartyRepo.fetchCounterpartyIds(
          {
            businessId: id,
          },
          500,
          pageNumber
        );
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

export const fetchIndividualDocuments = createAsyncThunk(
  "individual/fetchIndividualDocuments",
  async (id: number) => {
    try {
      const documents: IndividualDocument[] =
        await individualRepo.fetchIndividualDocuments(id);

      const docs: IndividualDocumentWithLink[] = [];

      if (documents.length > 0) {
        documents.forEach((document: any, index: number) => {
          docs.push({
            document: document,
            link:
              document.documentUrl == null ? "No Doc" : document.documentUrl,
          });
        });
        return docs;
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

export const createIndividualDocument = createAsyncThunk(
  "business/createIndividualDocument",
  async (data: { id: string; data: CreateIndividualDocument }) => {
    try {
      const doc = await individualRepo.createIndividualDocument(
        data.id,
        data.data
      );

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

export const uploadIndividualDocument = createAsyncThunk(
  "business/uploadIndividualDocument",
  async (data: { individualId: string; documentId: string; file: File }) => {
    try {
      const doc = await individualRepo.uploadIndividualDocument(
        data.individualId,
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

export const fetchIndividualDocumentUrl = createAsyncThunk(
  "business/fetchIndividualDocumentUrl",
  async (data: { individualId: number; documentId: number }) => {
    try {
      const url = await individualRepo.fetchIndividualDocumentUrl(
        data.individualId,
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

export const updateIndividual = createAsyncThunk(
  "individual/updateIndividual",
  async (data: { id: string; individual: Individual }) => {
    try {
      return await individualRepo.updateIndividual(data.id, data.individual);
    } catch (e: any) {
      return `Error updating Individual ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchIndividualCIPStatus = createAsyncThunk(
  "individual/fetchIndividualCIPStatus",
  async (id: string) => {
    try {
      return await individualRepo.fetchCIPStatus(id);
    } catch (e: any) {
      return `Error fetching CIP status ${generateErrorMessage(e)}`;
    }
  }
);

export const approveIndividual = createAsyncThunk(
  "individual/approveIndividual",
  async (id: number) => {
    try {
      return await individualRepo.approveIndividual(id);
    } catch (e: any) {
      return `Error approving Individual ${generateErrorMessage(e)}`;
    }
  }
);

export default IndividualSlice;
export const {
  setIndividualsPageSize,
  setIndividualsPageNumber,
  setInitialIndividualState,
  setRefreshIndividual,
  setIndividualCounterpartyPaginationPageNumber,
} = IndividualSlice.actions;
