import ApiClient from "@/core/api/ApiClient";
import { ACH, Statement } from "@/core/api/ApiTypes";
import { APP_TIMEZONE } from "@/core/constants";
import StatementRepo from "@/core/repos/statement_repo";
import { momentToPSTString } from "@/core/utils/dateTimeUtil";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const apiClient = ApiClient.getInstance();
const statementRepo: StatementRepo = new StatementRepo(apiClient);

export type StatementType = "loading" | string | ACH[];

interface StatementState {
  statement: Statement | string;
  statementType: "PRODUCT" | "ACCOUNT" | "PROGRAM" | "ROOT";
  accountNumber: string | null;
}

const initialState: StatementState = {
  statement: "loading",
  statementType: "PRODUCT",
  accountNumber: null,
};

const StatementSlice = createSlice({
  name: "statement",
  initialState,
  reducers: {
    setInitialStatementState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRootStatement.fulfilled, (state, action) => {
      state.statement = action.payload;
      state.statementType = "ROOT";
    });
    builder.addCase(fetchProgramStatement.fulfilled, (state, action) => {
      state.statement = action.payload;
      state.statementType = "PROGRAM";
    });
    builder.addCase(fetchProductStatement.fulfilled, (state, action) => {
      state.statement = action.payload;
      state.statementType = "PRODUCT";
    });
    builder.addCase(fetchAccountStatement.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.statement = action.payload;
      } else {
        state.statement = action.payload.statement;
        state.statementType = "ACCOUNT";
        state.accountNumber = action.payload.accountNumber;
      }
    });
  },
});

export const fetchRootStatement = createAsyncThunk(
  "statement/fetchRootStatement",
  async (data: { start: string; end: string }, thunkApi: any) => {
    try {
      const response = await statementRepo.fetchRootStatement(
        moment
          .tz(data.start, APP_TIMEZONE)
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss.SSSSSS") + "-08:00",
        moment
          .tz(data.end, APP_TIMEZONE)
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss.SSSSSS") + "-08:00"
      );
      return response;
    } catch (e: any) {
      return `Error fetching root statement ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchProgramStatement = createAsyncThunk(
  "statement/fetchProgramStatement",
  async (
    data: { start: string; end: string; programId: string },
    thunkApi: any
  ) => {
    try {
      const response = await statementRepo.fetchProgramStatement(
        moment
          .tz(data.start, APP_TIMEZONE)
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss.SSSSSS") + "-08:00",
        moment
          .tz(data.end, APP_TIMEZONE)
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss.SSSSSS") + "-08:00",
        data.programId
      );
      return response;
    } catch (e: any) {
      return `Error fetching program statement ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchProductStatement = createAsyncThunk(
  "statement/fetchProductStatement",
  async (
    data: { start: string; end: string; productId: string },
    thunkApi: any
  ) => {
    try {
      const response = await statementRepo.fetchProductStatement(
        moment
          .tz(data.start, APP_TIMEZONE)
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss.SSSSSS") + "-08:00",
        moment
          .tz(data.end, APP_TIMEZONE)
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss.SSSSSS") + "-08:00",
        data.productId
      );
      return response;
    } catch (e: any) {
      return `Error fetching product statement ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchAccountStatement = createAsyncThunk(
  "statement/fetchAccountStatement",
  async (
    data: { start: string; end: string; accountId: string },
    thunkApi: any
  ) => {
    try {
      const response = await statementRepo.fetchAccountStatement(
        moment
          .tz(data.start, APP_TIMEZONE)
          .startOf("day")
          .format("YYYY-MM-DDTHH:mm:ss.SSSSSS") + "-08:00",
        moment
          .tz(data.end, APP_TIMEZONE)
          .endOf("day")
          .format("YYYY-MM-DDTHH:mm:ss.SSSSSS") + "-08:00",
        data.accountId
      );
      return {
        statement: response,
        accountNumber: data.accountId,
      };
    } catch (e: any) {
      return `Error fetching account statement ${generateErrorMessage(e)}`;
    }
  }
);

export default StatementSlice;
export const { setInitialStatementState } = StatementSlice.actions;
