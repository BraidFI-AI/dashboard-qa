import ApiClient from "@/core/api/ApiClient";
import {
  AccountCard,
  Counterparty,
  CreateAcount,
  CreateIndividualDocument,
  CustomerAccount,
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
  counterparties: IndividualCounterpartyType;
  accountIds: IndividualAccountIdsType;
  counterpartyPagination: PaginationStateType;
  refresh: boolean;
  individual: "loading" | string | Individual;
}

const initialState: IndividualState = {
  individuals: null,
  counterparties: "loading",
  accountIds: "loading",
  refresh: true,
  individual: "loading",
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchIndividualV2.pending, (state, action) => {
      state.individual = "loading";
    });
    builder.addCase(fetchIndividualV2.fulfilled, (state, action) => {
      state.individual = action.payload;
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
    builder.addCase(fetchIndividualAccountIds.pending, (state, action) => {
      state.accountIds = "loading";
    });
    builder.addCase(fetchIndividualAccountIds.fulfilled, (state, action) => {
      state.accountIds = action.payload;
    });
    builder.addCase(fetchIndividualAccountNumbers.pending, (state, action) => {
      state.accountIds = "loading";
    });
    builder.addCase(
      fetchIndividualAccountNumbers.fulfilled,
      (state, action) => {
        state.accountIds = action.payload;
      }
    );
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
        data.id,
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

export const fetchIndividualAccountsCards = createAsyncThunk(
  "individual/fetchIndividualAccountsCards",
  async (individual: Individual) => {
    try {
      const accounts: CustomerAccount[] =
        await individualRepo.fetchIndividualAccounts(individual.id);

      const accountCardApis: any = [];
      const cards: AccountCard[] = [];

      accounts.forEach((account: CustomerAccount) => {
        accountCardApis.push(
          individualRepo.fetchIndividualAccountCards(account.id)
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
  async (id: number) => {
    try {
      const accounts = await individualRepo.fetchIndividualAccounts(id);
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

export const fetchIndividualAccountsV2 = createAsyncThunk(
  "individual/fetchBusinessAccounts",
  async (id: number) => {
    try {
      const accounts = await individualRepo.fetchIndividualAccounts(id);
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

export const fetchIndividualAccountIds = createAsyncThunk(
  "business/fetchIndividualAccountIds",
  async (id: string) => {
    try {
      const ids = await individualRepo.fetchIndividualAccountIds(id);
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

export const fetchIndividualAccountNumbers = createAsyncThunk(
  "individindividualual/fetchBusinessAccountNumbers",
  async (id: string) => {
    try {
      const ids = await individualRepo.fetchIndividualAccountNumbers(id);
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

export const fetchIndividualAccountCounterpartiesIds = createAsyncThunk(
  "business/fetchIndividualAccountCounterpartiesIds",
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

export const fetchIndividualDocuments = createAsyncThunk(
  "individual/fetchIndividualDocuments",
  async (id: number) => {
    try {
      const documents: IndividualDocument[] =
        await individualRepo.fetchIndividualDocuments(id);

      if (documents.length > 0) {
        const urls: any[] = [];
        documents.forEach((document: IndividualDocument) => {
          if (document.status !== "REQUIRED") {
            urls.push(
              individualRepo.fetchIndividualDocumentUrl(id, document.id)
            );
          } else {
            urls.push("No Doc");
          }
        });

        try {
          const data: any = await Promise.all(urls);
          const docs: IndividualDocumentWithLink[] = [];

          documents.forEach((document: any, index: number) => {
            docs.push({ document: document, link: data[String(index)] });
          });
          return docs;
        } catch (e: any) {
          enqueueSnackbar(`Error (Document Link): ${e.message}`, {
            variant: "error",
          });
        }
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

export const approveIndividual = createAsyncThunk(
  "individual/approveIndividual",
  async (id: number) => {
    try {
      ``;
      //2023-09-19T11:41:22.658Z
      const date = moment();

      const month: string =
        date.month() < 9 ? `0${date.month() + 1}` : `${date.month() + 1}`;

      const dat: string =
        date.date() <= 9 ? `0${date.date()}` : `${date.date()}`;

      const hour: string =
        date.hours() <= 9 ? `0${date.hours()}` : `${date.hours()}`;

      const minute: string =
        date.minutes() <= 9 ? `0${date.minutes()}` : `${date.minutes()}`;

      const second: string =
        date.seconds() <= 9 ? `0${date.seconds()}` : `${date.seconds()}`;

      const ms: string =
        date.milliseconds() <= 9
          ? `0${date.milliseconds()}`
          : `${date.milliseconds()}`;

      let dateTime =
        date.year() +
        "-" +
        month +
        "-" +
        dat +
        "T" +
        hour +
        ":" +
        minute +
        ":" +
        second +
        "." +
        ms +
        "Z";

      return await individualRepo.approveIndividual(id, dateTime);
    } catch (e: any) {
      return `Error approving Individual ${generateErrorMessage(e)}`;
    }
  }
);

export default IndividualSlice;
export const {
  setInitialIndividualState,
  setRefreshIndividual,
  setIndividualCounterpartyPaginationPageNumber,
} = IndividualSlice.actions;
