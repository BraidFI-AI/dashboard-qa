import ApiClient from "@/core/api/ApiClient";
import { Transaction } from "@/core/api/ApiTypes";
import { PaginationStateType, paginationPageSize } from "@/core/constants";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment, { Moment } from "moment";
import ReconExceptionReviewRepo from "@/core/repos/recon_exception_review_repo";
import { momentToTimeZoneString } from "@/core/utils/date_time_util";

const apiClient = ApiClient.getInstance();
const reconExceptionReviewRepo = new ReconExceptionReviewRepo(apiClient);

interface ReconExceptionReviewState {
  transactionsPaginated: "initial" | "loading" | string | Transaction[];
  transactionsPagination: PaginationStateType;
  settlementsPaginated: "initial" | "loading" | string | any[];
  settlementsPagination: PaginationStateType;
}

const initialState: ReconExceptionReviewState = {
  transactionsPaginated: "initial",
  transactionsPagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
    pageSize: paginationPageSize,
  },
  settlementsPaginated: "initial",
  settlementsPagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
    pageSize: paginationPageSize,
  },
};
const ReconExceptionReviewSlice = createSlice({
  name: "reconExceptionReview",
  initialState,
  reducers: {
    setInitialReconExceptionReviewState(state) {
      Object.assign(state, initialState);
    },
    setTransactionsPageNumber(state, action) {
      state.transactionsPagination.pageNumber = action.payload;
    },
    setSettlementsPageNumber(state, action) {
      state.settlementsPagination.pageNumber = action.payload;
    },
    setTransactionsPaginationPageSize(state, action) {
      state.transactionsPagination.pageSize = action.payload;
    },
    setSettlementsPaginationPageSize(state, action) {
      state.settlementsPagination.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTransactionsPaginated.pending, (state, action) => {
      if (
        state.transactionsPagination.pageNumber == -1 ||
        action.meta.arg.refresh
      ) {
        state.transactionsPaginated = "loading";
      }
      state.transactionsPagination.loadingPage = true;
    });
    builder.addCase(fetchTransactionsPaginated.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.transactionsPaginated = action.payload;
      } else {
        state.transactionsPaginated = action.payload.transactions;
        state.transactionsPagination.rowCount = action.payload.rowCount;
        state.transactionsPagination.pageNumber = action.payload.pageNumber;
      }

      state.transactionsPagination.loadingPage = false;
    });
    builder.addCase(fetchSettlementsPaginated.pending, (state, action) => {
      if (
        state.settlementsPagination.pageNumber == -1 ||
        action.meta.arg.refresh
      ) {
        state.settlementsPaginated = "loading";
      }
      state.settlementsPagination.loadingPage = true;
    });
    builder.addCase(fetchSettlementsPaginated.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.settlementsPaginated = action.payload;
      } else {
        state.settlementsPaginated = action.payload.settlements;
        state.settlementsPagination.rowCount = action.payload.rowCount;
        state.settlementsPagination.pageNumber = action.payload.pageNumber;
      }

      state.settlementsPagination.loadingPage = false;
    });
  },
});

export const fetchTransactionsPaginated = createAsyncThunk(
  "reconExceptionReview/fetchTransactionsPaginated",
  async (
    data: {
      refresh: boolean;
      beginDate: Moment;
      endDate: Moment;
      transactionType: "ACH" | "WIRE";
    },
    thunkApi: any
  ) => {
    try {
      const transactions =
        await reconExceptionReviewRepo.fetchTransactionsPaginated(
          thunkApi.getState().reconExceptionReview.transactionsPagination
            .pageSize ?? paginationPageSize,
          data.refresh == true
            ? 0
            : thunkApi.getState().reconExceptionReview.transactionsPagination
                .pageNumber == -1
            ? 0
            : thunkApi.getState().reconExceptionReview.transactionsPagination
                .pageNumber,
          momentToTimeZoneString(data.beginDate, true),
          momentToTimeZoneString(data.endDate, false),
          data.transactionType
        );
      console.log("transactions", transactions);

      return {
        transactions: transactions.content,
        rowCount: transactions.totalElements,
        pageNumber: transactions.number,
      };
    } catch (e: any) {
      return `Error fetching transactions ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchSettlementsPaginated = createAsyncThunk(
  "reconExceptionReview/fetchSettlementsPaginated",
  async (
    data: {
      refresh: boolean;
      beginDate: Moment;
      endDate: Moment;
      transactionType: "ACH" | "WIRE";
    },
    thunkApi: any
  ) => {
    try {
      const transactions =
        await reconExceptionReviewRepo.fetchSettlementsPaginated(
          thunkApi.getState().reconExceptionReview.settlementsPagination
            .pageSize ?? paginationPageSize,
          data.refresh == true
            ? 0
            : thunkApi.getState().reconExceptionReview.settlementsPagination
                .pageNumber == -1
            ? 0
            : thunkApi.getState().reconExceptionReview.settlementsPagination
                .pageNumber,
          momentToTimeZoneString(data.beginDate, true),
          momentToTimeZoneString(data.endDate, false),
          data.transactionType
        );
      console.log("settlements", transactions);

      return {
        settlements: transactions.content,
        rowCount: transactions.totalElements,
        pageNumber: transactions.number,
      };
    } catch (e: any) {
      return `Error fetching settlements ${generateErrorMessage(e)}`;
    }
  }
);

export const performManualMatch = createAsyncThunk(
  "reconExceptionReview/performManualMatch",
  async (
    data: {
      notes: string;
      transactionAuditId: string;
      settlementFileId: string;
      settlementFileType: "ACH" | "WIRE";
    },
    thunkApi: any
  ) => {
    try {
      const response = await reconExceptionReviewRepo.performManualMatch(data);
      console.log("manual match performed successfully", response);
      return { response: "success" };
    } catch (e: any) {
      return `Error performing manual match ${generateErrorMessage(e)}`;
    }
  }
);

export default ReconExceptionReviewSlice;
export const {
  setTransactionsPageNumber,
  setSettlementsPageNumber,
  setInitialReconExceptionReviewState,
  setTransactionsPaginationPageSize,
  setSettlementsPaginationPageSize,
} = ReconExceptionReviewSlice.actions;
