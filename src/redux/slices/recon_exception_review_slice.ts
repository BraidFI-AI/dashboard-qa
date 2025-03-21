import ApiClient from "@/core/api/ApiClient";
import { Transaction } from "@/core/api/ApiTypes";
import { PaginationStateType, paginationPageSize } from "@/core/constants";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment, { Moment } from "moment";
import ReconExceptionReviewRepo from "@/core/repos/recon_exception_review_repo";
import { momentToPSTString } from "@/core/utils/dateTimeUtil";

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
    console.log("data 2", data);
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
          momentToPSTString(data.beginDate, true),
          momentToPSTString(data.endDate, false),
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

export default ReconExceptionReviewSlice;
export const {
  setTransactionsPageNumber,
  setSettlementsPageNumber,
  setInitialReconExceptionReviewState,
} = ReconExceptionReviewSlice.actions;
