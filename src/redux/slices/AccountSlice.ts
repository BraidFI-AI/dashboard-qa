import ApiClient from "@/core/api/ApiClient";
import {
  Account,
  Counterparty,
  IdsListType,
  OneTimeFees,
  Transaction,
} from "@/core/api/ApiTypes";
import { PaginationStateType, paginationPageSize } from "@/core/constants";
import AccountRepo from "@/core/repos/AccountRepo";
import CounterpartyRepo from "@/core/repos/CounterpartyRepo";
import TransactionRepo from "@/core/repos/TransactionRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const accountRepo: AccountRepo = new AccountRepo(apiClient);
const transactionRepo: TransactionRepo = new TransactionRepo(apiClient);
const counterpartyRepo: CounterpartyRepo = new CounterpartyRepo(apiClient);

export type AccountTransactionsType = "loading" | string | Transaction[];
export type AccountCounterpartyType = "loading" | string | Counterparty[];
export type AccountCounterpartyIdsType = "loading" | string | IdsListType[];

interface AccountState {
  accounts: "loading" | string | Account[];
  accontsPagination: PaginationStateType;
  accountTransactions: AccountTransactionsType;
  counterparties: AccountCounterpartyType;
  counterpartyIds: AccountCounterpartyIdsType;
  counterpartyPagination: PaginationStateType;
}

const initialState: AccountState = {
  accounts: "loading",
  accountTransactions: "loading",
  counterparties: "loading",
  counterpartyIds: "loading",
  accontsPagination: {
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

const AccountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setInitialAccountState(state) {
      Object.assign(state, initialState);
    },
    setAccountsPaginationPageNumber(state, action) {
      state.accontsPagination.pageNumber = action.payload;
    },
    setAccountCounterpartyPaginationPageNumber(state, action) {
      state.counterpartyPagination.pageNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccounts.pending, (state, action) => {
      if (state.accontsPagination.pageNumber == -1 || action.meta.arg == true) {
        state.accounts = "loading";
      }
      state.accontsPagination.loadingPage = true;
    });
    builder.addCase(fetchAccounts.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.accounts = action.payload;
      } else {
        state.accounts = action.payload.accounts;
        state.accontsPagination.rowCount = action.payload.rowCount;
        state.accontsPagination.pageNumber = action.payload.pageNumber;
      }

      state.accontsPagination.loadingPage = false;
    });
    // builder.addCase(fetchAccountTransactionsData.pending, (state, action) => {
    //   state.accountTransactions = "loading";
    // });
    // builder.addCase(fetchAccountTransactionsData.fulfilled, (state, action) => {
    //   state.accountTransactions = action.payload;
    // });
    builder.addCase(fetchAccountCounterparties.pending, (state, action) => {
      if (state.counterpartyPagination.pageNumber == -1) {
        state.counterparties = "loading";
      }
      state.counterpartyPagination.loadingPage = true;
    });
    builder.addCase(fetchAccountCounterparties.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.counterparties = action.payload;
      } else {
        state.counterparties = action.payload.counterparties;
        state.counterpartyPagination.rowCount = action.payload.rowCount;
        state.counterpartyPagination.pageNumber = action.payload.pageNumber;
      }

      state.counterpartyPagination.loadingPage = false;
    });
    builder.addCase(fetchAccountCounterpartyIds.pending, (state, action) => {
      state.counterpartyIds = "loading";
    });
    builder.addCase(fetchAccountCounterpartyIds.fulfilled, (state, action) => {
      state.counterpartyIds = action.payload;
    });
  },
});

export const fetchAccountCounterparties = createAsyncThunk(
  "account/fetchAccountCounterparties",
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
      console.log("Account counterparties", counterparties);
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

export const fetchAccountCounterpartyIds = createAsyncThunk(
  "account/fetchAccountCounterpartiesIds",
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

export const fetchAccounts = createAsyncThunk(
  "account/fetchAccounts",
  async (refresh: boolean, thunkApi: any) => {
    try {
      const accounts = await accountRepo.fetchAccounts(
        paginationPageSize,
        thunkApi.getState().account.accontsPagination == -1 || refresh == true
          ? 0
          : thunkApi.getState().account.accontsPagination
      );
      console.log("accounts", accounts);
      return {
        accounts: accounts.content,
        rowCount: accounts.totalElements,
        pageNumber: accounts.number,
      };
    } catch (e: any) {
      return `Error fetching accounts ${generateErrorMessage(e)}`;
    }
  }
);

export const chargeOneTimeFee = createAsyncThunk(
  "account/chargeOneTimeFee",
  async (data: OneTimeFees) => {
    try {
      const fee = await accountRepo.chargeOneTimeFee(data);
      console.log("fee", fee);
      return fee;
    } catch (e: any) {
      enqueueSnackbar(
        `Error charging one time fee ${generateErrorMessage(e)}`,
        {
          variant: "error",
          persist: true,
        }
      );
      return null;
    }

    return null;
  }
);

export const fetchAccountv2 = createAsyncThunk(
  "account/fetchAccountv2",
  async (id: string) => {
    try {
      const accounts = await accountRepo.fetchAccount(id);
      console.log("account", accounts);
      return accounts;
    } catch (e: any) {
      return `Error fetching account ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchAccount = createAsyncThunk(
  "account/fetchAccounts",
  async (id: string) => {
    try {
      const accounts = await accountRepo.fetchAccount(id);
      console.log("account", accounts);
      return accounts;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching account ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchAccountBalance = createAsyncThunk(
  "account/fetchAccounts",
  async (id: string) => {
    try {
      const balance = await accountRepo.fetchAccountBalance(id);
      console.log("balance", balance);
      return balance;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching balance ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

// export const fetchAccountTransactionsData = createAsyncThunk(
//   "account/fetchAccountTransactionsData",
//   async (id: string) => {
//     try {
//       const account = await accountRepo.fetchAccount(id);

//       if (account.accountNumber && account.productId) {
//         const transactions = await transactionRepo.fetchTransactions({
//           productId: account.productId,
//           accountNumber: account.accountNumber,
//         });

//         console.log("account", account);
//         console.log("account Transactions", transactions);

//         return transactions;
//       } else {
//         return "Account number of product ID not found on the account";
//       }
//     } catch (e: any) {
//       const errorMessage: string = `Error fetching account transactions: ${generateErrorMessage(
//         e
//       )}`;
//       return errorMessage;
//     }
//   }
// );

export const updateAccountStatusDev = createAsyncThunk(
  "account/updateAccount",
  async (data: { id: string; status: string }) => {
    try {
      const account = await accountRepo.updateAccountStatusDev(
        data.id,
        data.status
      );
      console.log("account status", account);
      return account;
    } catch (e: any) {
      enqueueSnackbar(
        `Error updating account status ${generateErrorMessage(e)}`,
        {
          variant: "error",
          persist: true,
        }
      );
    }

    return null;
  }
);

export const updateAccount = createAsyncThunk(
  "account/updateAccount",
  async (data: {
    id: string;
    status: string;
    accountName?: string;
    canAcceptSweep?: string;
    fundingAccountNumber?: string;
    sweepAccountNumber?: string;
  }) => {
    try {
      const account = await accountRepo.updateAccount(data.id, {
        ...data,
      });
      console.log("account status", account);
      return account;
    } catch (e: any) {
      enqueueSnackbar(`Error updating account s ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchIndividualOrBusiness = createAsyncThunk(
  "account/fetchIndividualOrBusiness",
  async (id: string) => {
    try {
      const customer = await accountRepo.fetchIndividualOrBusiness(id);
      console.log("customer", customer);
      return customer;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching customer ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchAccountNumbersList = createAsyncThunk(
  "account/fetchAccountlIdsList",
  async () => {
    try {
      const accountIds = await accountRepo.fetchAccountNumbersList();
      return accountIds;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching accounts ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchAccountIdsList = createAsyncThunk(
  "account/fetchAccountlIdsList",
  async () => {
    try {
      const accountIds = await accountRepo.fetchAccountIdsList();
      return accountIds;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching accounts ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export default AccountSlice;
export const {
  setInitialAccountState,
  setAccountCounterpartyPaginationPageNumber,
  setAccountsPaginationPageNumber,
} = AccountSlice.actions;
