import ApiClient from "@/core/api/ApiClient";
import { ACH } from "@/core/api/ApiTypes";
import { PaginationStateType, paginationPageSize } from "@/core/constants";
import NocRepo from "@/core/repos/noc_repo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const apiClient = ApiClient.getInstance();
const nocRepo: NocRepo = new NocRepo(apiClient);

export type NocType = "loading" | string | ACH[];

interface NocState {
  noc: NocType;
  pagination: PaginationStateType;
}

const initialState: NocState = {
  noc: "loading",
  pagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
  },
};

const NocSlice = createSlice({
  name: "noc",
  initialState,
  reducers: {
    setInitialNOCState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNoc.pending, (state, action) => {
      if (state.pagination.pageNumber == -1) {
        state.noc = "loading";
      }
      state.pagination.loadingPage = true;
    });
    builder.addCase(fetchNoc.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.noc = action.payload;
      } else {
        state.noc = action.payload.transactions;
        state.pagination.rowCount = action.payload.rowCount;
        state.pagination.pageNumber = action.payload.pageNumber;
      }

      state.pagination.loadingPage = false;
    });
  },
});

export const fetchNoc = createAsyncThunk(
  "noc/fetchNoc",
  async (data: { refresh?: boolean }, thunkApi: any) => {
    try {
      const noc = await nocRepo.fetchNoc(
        paginationPageSize,
        data.refresh
          ? 0
          : thunkApi.getState().transaction.pagination.pageNumber == -1
          ? 0
          : thunkApi.getState().transaction.pagination.pageNumber
      );

      console.log("noc:", noc);
      return {
        transactions: noc.content,
        rowCount: noc.totalElements,
        pageNumber: noc.number,
      };
    } catch (e: any) {
      console.log("Error fetching noc transactions:", e);
      return `Error fetching noc transactions ${generateErrorMessage(e)}`;
    }
  }
);

export default NocSlice;
export const { setInitialNOCState } = NocSlice.actions;
