import ApiClient from "@/core/api/ApiClient";
import { Transaction, TransactionSearch } from "@/core/api/ApiTypes";
import { PaginationStateType, paginationPageSize } from "@/core/constants";
import TransactionRepo from "@/core/repos/TransactionRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { isEqual } from "lodash";
import AccountRepo from "@/core/repos/AccountRepo";
import IndividualRepo from "@/core/repos/IndividualRepo";
import BusinessRepo from "@/core/repos/BusinessRepo";
import { momentToTimeZoneString } from "@/core/utils/date_time_util";

const apiClient = ApiClient.getInstance();
const transactionRepo: TransactionRepo = new TransactionRepo(apiClient);
const accountRepo: AccountRepo = new AccountRepo(apiClient);
const individualRepo: IndividualRepo = new IndividualRepo(apiClient);
const businessRepo: BusinessRepo = new BusinessRepo(apiClient);

interface TransactionState {
  loading: boolean;
  title: string;
  transactions: "loading" | string | Transaction[];
  pagination: PaginationStateType;
  criteria: any;
}

const initialState: TransactionState = {
  loading: true,
  title: "",
  transactions: "loading",
  criteria: {},
  pagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
    pageSize: paginationPageSize,
  },
};

const TransactionSlice = createSlice({
  name: "transaction",
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
    setPaginationPageSize(state, action) {
      state.pagination.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTransactions.pending, (state, action) => {
      if (state.pagination.pageNumber == -1) {
        state.transactions = "loading";
      }
      state.pagination.loadingPage = true;
    });
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.transactions = action.payload;
      } else {
        state.transactions = action.payload.transactions;
        state.pagination.rowCount = action.payload.rowCount;
        state.pagination.pageNumber = action.payload.pageNumber;
        state.criteria = action.payload.criteria;
      }

      state.pagination.loadingPage = false;
    });
  },
});

export const updateTransactionIMAD = createAsyncThunk(
  "transaction/updateTransactionIMAD",
  async (data: { paymentId: string; imad: string }, thunkAPI: any) => {
    try {
      const trans = await transactionRepo.updateTransactionIMAD(data);
      return trans;
    } catch (e: any) {
      return `Error updating transaction ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchTransactionByPaymentId = createAsyncThunk(
  "transaction/createUser",
  async (paymentId: string, thunkAPI: any) => {
    try {
      const trans = await transactionRepo.fetchTransactionByPaymentId(
        paymentId
      );

      if (trans.length == 0) {
        return `Transaction not found`;
      } else {
        return trans[0];
      }
    } catch (e: any) {
      return `Error fetching transaction ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  "transaction/fetchTransactions",
  async (
    data: { criteria: TransactionSearch; refresh?: boolean },
    thunkApi: any
  ) => {
    if (data.criteria.accountNumber == "") {
      data.criteria.accountNumber = undefined;
    }
    if (data.criteria.paymentId == "") {
      data.criteria.paymentId = undefined;
    }
    if (
      data.criteria.transactionType != null &&
      typeof data.criteria.transactionType == "string"
    ) {
      data.criteria.transactionType = [data.criteria.transactionType];
    }
    if (
      data.criteria.processingStatus != null &&
      typeof data.criteria.processingStatus == "string"
    ) {
      data.criteria.processingStatus = [data.criteria.processingStatus];
    }
    if (
      data.criteria.transactionStatus != null &&
      typeof data.criteria.transactionStatus == "string"
    ) {
      data.criteria.transactionStatus = [data.criteria.transactionStatus];
    }

    try {
      if (data.criteria.beginDate) {
        data.criteria = {
          ...data.criteria,
          beginDate: momentToTimeZoneString(
            moment(data.criteria.beginDate),
            true
          ),
        };
      }
      if (data.criteria.endDate) {
        data.criteria = {
          ...data.criteria,
          endDate: momentToTimeZoneString(moment(data.criteria.endDate), false),
        };
      }

      if (data.criteria.postDateStart) {
        data.criteria = {
          ...data.criteria,
          postDateStart: momentToTimeZoneString(
            moment(data.criteria.postDateStart),
            true
          ),
        };
      }
      if (data.criteria.postDateEnd) {
        data.criteria = {
          ...data.criteria,
          postDateEnd: momentToTimeZoneString(
            moment(data.criteria.postDateEnd),
            false
          ),
        };
      }

      if (
        data.criteria.transactionType == null &&
        data.criteria.transactionType != undefined
      ) {
        data.criteria.transactionType = undefined;
      }

      console.log("Search filters:", data.criteria);

      // if the search criteria has changed then its a new call starting from page 0
      const same: boolean = isEqual(
        data.criteria,
        thunkApi.getState().transaction.criteria
      );

      if (!same || (data.refresh != null && data.refresh == true)) {
        thunkApi.dispatch(setLoadingTransactions());
      }

      const transactions = await transactionRepo.fetchTransactions(
        data.criteria,
        thunkApi.getState().transaction.pagination.pageSize ??
          paginationPageSize,
        thunkApi.getState().transaction.pagination.pageNumber == -1 || !same
          ? 0
          : thunkApi.getState().transaction.pagination.pageNumber
      );

      // const transactionsWithCustomers = await thunkApi.dispatch(
      //   fetchCustomerInformation(transactions.content)
      // );

      return {
        transactions: transactions.content,
        rowCount: transactions.totalElements,
        pageNumber: transactions.number,
        criteria: data.criteria,
      };
    } catch (e: any) {
      return `Error fetching transactions ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchCustomerInformation = createAsyncThunk(
  "program/fetchCustomerInformation",
  async (transactions: Transaction[], thunkApi: any) => {
    try {
      const updatedTransactions = await Promise.all(
        transactions.map(async (transaction) => {
          if (transaction.ach == undefined || transaction.ach == null) {
            const account = await accountRepo.fetchAccount(
              transaction.accountNumber
            );

            let customerName = "";
            let customerType = "";

            try {
              const business = await businessRepo.fetchBusiness(
                account.customerId ?? -1
              );

              customerName = business.name;
              customerType = "BUSINESS";
            } catch (e: any) {
              const err = generateErrorMessage(e);
              if (err == "Not found") {
                const individual = await individualRepo.fetchIndividual(
                  account.customerId ?? -1
                );
                customerName = individual.firstName + " " + individual.lastName;
                customerType = "INDIVIDUAL";
              } else {
                throw e;
              }
            }

            return {
              ...transaction,
              customerId: account.customerId,
              customerName: customerName,
              customerType: customerType,
            };
          }
          return transaction;
        })
      );

      return updatedTransactions;
    } catch (e: any) {
      return `Error fetching transactions ${generateErrorMessage(e)}`;
    }
  }
);

export const cancelTransaction = createAsyncThunk(
  "app/cancelTransaction",
  async (
    data: {
      paymentId: string;
      reason: string;
    },
    thunkApi: any
  ) => {
    try {
      const cancelTransaction = await transactionRepo.cancelTransaction(data);
      console.log("Transaction cancelled:", cancelTransaction);
      return { success: true, data: cancelTransaction };
    } catch (err: any) {
      return `Error cancelling transaction ${generateErrorMessage(err)}`;
    }
  }
);

export const returnAchTransaction = createAsyncThunk(
  "app/returnAchTransaction",
  async (
    data: {
      paymentId: string;
      returnCode: string;
    },
    thunkApi: any
  ) => {
    try {
      const returnAch = await transactionRepo.returnAchTransaction(data);
      console.log("ach transaction returned:", returnAch);
      return returnAch;
    } catch (err: any) {
      return `Error returning ach transaction ${generateErrorMessage(err)}`;
    }
  }
);

export const returnWireTransaction = createAsyncThunk(
  "app/returnWireTransaction",
  async (
    data: {
      paymentId: string;
      returnCode: string;
    },
    thunkApi: any
  ) => {
    try {
      const returnWire = await transactionRepo.returnWireTransaction(data);
      console.log("wire transaction returned:", returnWire);
      return returnWire;
    } catch (err: any) {
      return `Error returning wire transaction ${generateErrorMessage(err)}`;
    }
  }
);

export default TransactionSlice;
export const {
  setInitialTransactionState,
  setPaginationPageNumber,
  setLoadingTransactions,
  setPaginationPageSize,
} = TransactionSlice.actions;
