import ApiClient from "@/core/api/ApiClient";
import { Transaction } from "@/core/api/ApiTypes";
import { PaginationStateType, paginationPageSize } from "@/core/constants";
import TransactionRepo from "@/core/repos/TransactionRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AccountRepo from "@/core/repos/AccountRepo";
import IndividualRepo from "@/core/repos/IndividualRepo";
import BusinessRepo from "@/core/repos/BusinessRepo";
import AlertsRepo from "@/core/repos/alerts_repo";

const apiClient = ApiClient.getInstance();
const transactionRepo: TransactionRepo = new TransactionRepo(apiClient);
const accountRepo: AccountRepo = new AccountRepo(apiClient);
const individualRepo: IndividualRepo = new IndividualRepo(apiClient);
const businessRepo: BusinessRepo = new BusinessRepo(apiClient);
const alertsRepo: AlertsRepo = new AlertsRepo(apiClient);

interface TransactionReviewState {
  loading: boolean;
  title: string;
  transactions: "loading" | string | Transaction[];
  pagination: PaginationStateType;
  criteria: any;
}

const initialState: TransactionReviewState = {
  loading: true,
  title: "",
  transactions: "loading",
  criteria: {},
  pagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
  },
};

const TransactionReviewSlice = createSlice({
  name: "transactionReview",
  initialState,
  reducers: {
    setInitialTransactionState(state) {
      Object.assign(state, initialState);
    },
    setLoadingTransactions(state) {
      state.transactions = "loading";
    },
    setLoadingPage(state, action) {
      state.pagination.loadingPage = action.payload;
    },
    setPaginationPageNumber(state, action) {
      state.pagination.pageNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchToReviewACHTransactions.pending, (state, action) => {
      if (state.pagination.pageNumber == -1) {
        state.transactions = "loading";
      }
      state.pagination.loadingPage = true;
    });
    builder.addCase(fetchToReviewACHTransactions.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.transactions = action.payload;
      } else {
        state.transactions = action.payload.transactions;
        state.pagination.rowCount = action.payload.rowCount;
        state.pagination.pageNumber = action.payload.pageNumber;
      }

      state.pagination.loadingPage = false;
    });
  },
});

export const fetchToReviewACHTransactions = createAsyncThunk(
  "program/fetchToReviewACHTransactions",
  async (
    data: {
      refresh?: boolean;
      filter: {
        includeWire?: boolean;
        includeAch?: boolean;
        wireFileHandle?: string;
      };
    },
    thunkApi: any
  ) => {
    try {
      const transactions = await transactionRepo.fetchToReviewACHTransactions(
        paginationPageSize,
        data.refresh != null && data.refresh == true
          ? 0
          : thunkApi.getState().transactionReview.pagination.pageNumber == -1
          ? 0
          : thunkApi.getState().transactionReview.pagination.pageNumber,
        data.filter
      );
      console.log("transactions to review:", transactions.content);
      return {
        transactions: transactions.content,
        rowCount: transactions.totalElements,
        pageNumber: transactions.number,
      };
    } catch (e: any) {
      return `Error fetching transactions to review ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchBreachedLimits = createAsyncThunk(
  "program/fetchBreachedLimits",
  async (id: string) => {
    try {
      const trans = await transactionRepo.fetchBreachedLimits(id);
      console.log("breached limits:", trans);
      return trans;
    } catch (e: any) {
      return `Error fetching breached limits ${generateErrorMessage(e)}`;
    }
  }
);

export const updateTransactionStatus = createAsyncThunk(
  "program/approveTransaction",
  async (
    data: {
      alertId: string;
      action: string;
      note: string;
      filter?: {
        includeWire?: boolean;
        includeAch?: boolean;
        wireFileHandle?: string;
      };
    },
    thunkApi: any
  ) => {
    try {
      const trans = await alertsRepo.resolveAlert(data);
      console.log(
        `transaction ${
          data.action.toLowerCase() == "approve" ? "approved" : "rejected"
        }:`,
        trans
      );

      thunkApi.dispatch(
        fetchToReviewACHTransactions({ filter: data.filter ?? {} })
      );

      return trans;
    } catch (e: any) {
      return `Error ${
        data.action.toLowerCase() == "approve" ? "approving" : "rejecting"
      } transaction ${generateErrorMessage(e)}`;
    }
  }
);

export default TransactionReviewSlice;
export const {
  setInitialTransactionState,
  setPaginationPageNumber,
  setLoadingTransactions,
} = TransactionReviewSlice.actions;
