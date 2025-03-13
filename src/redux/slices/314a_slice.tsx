import ApiClient from "@/core/api/ApiClient";
import { Compliance314A } from "@/core/api/ApiTypes";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import Compliance314aRepo from "@/core/repos/314a_repo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const apiClient = ApiClient.getInstance();
const repo: Compliance314aRepo = new Compliance314aRepo(apiClient);
//
interface Compliance314AState {
  data: "loading" | string | Compliance314A[];
  pagination: PaginationStateType;
}

const initialState: Compliance314AState = {
  data: "loading",
  pagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
    pageSize: paginationPageSize,
  },
};

const Compliance314aSlice = createSlice({
  name: "314a",
  initialState,
  reducers: {
    setInitial314AState(state) {
      Object.assign(state, initialState);
    },
    set314ATablePageNumber(state, action) {
      state.pagination.pageNumber = action.payload;
    },
    set314ATablePageSize(state, action) {
      state.pagination.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetch314aData.pending, (state, action) => {
      if (state.pagination.pageNumber == -1 || action.meta.arg == true) {
        state.data = "loading";
      }
      state.pagination.loadingPage = true;
    });
    builder.addCase(fetch314aData.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.data = action.payload;
      } else {
        state.data = action.payload.data;
        state.pagination.rowCount = action.payload.rowCount;
        state.pagination.pageNumber = action.payload.pageNumber;
      }

      state.pagination.loadingPage = false;
    });
  },
});

export const upload314aFile = createAsyncThunk(
  "314a/upload314aFile",
  async (file: any) => {
    try {
      const upload = await repo.upload314aFile(file);
      console.log("314a file uploaded", upload);
      return upload;
    } catch (e: any) {
      return `Error upload 314a file ${generateErrorMessage(e)}`;
    }
  }
);

export const fetch314aData = createAsyncThunk(
  "314a/fetch314aData",
  async (refresh: boolean, thunkApi: any) => {
    try {
      const data = await repo.fetch314aData(
        thunkApi.getState().compliance314a.pagination.pageSize ?? 100,
        thunkApi.getState().compliance314a.pagination.pageNumber == -1 ||
          refresh == true
          ? 0
          : thunkApi.getState().compliance314a.pagination.pageNumber
      );
      console.log("314a data", data);
      return {
        data: data.content,
        rowCount: data.totalElements,
        pageNumber: data.number,
      };
    } catch (e: any) {
      return `Error fetching 314a data ${generateErrorMessage(e)}`;
    }
  }
);

export const fetch314ARecord = createAsyncThunk(
  "314a/fetch314ARecord",
  async (id: string) => {
    try {
      const upload = await repo.fetch314aRecord(id);
      console.log("314a data", upload);
      return upload;
    } catch (e: any) {
      return `Error fetching 314a data ${generateErrorMessage(e)}`;
    }
  }
);

export const fetch314ALog = createAsyncThunk(
  "314a/fetch314ALog",
  async (data: { startDateTime: string; endDateTime: string }) => {
    try {
      const logs = await repo.fetch314aLog(
        data.startDateTime,
        data.endDateTime
      );

      return logs;
    } catch (e: any) {
      return `Error fetching 314a data ${generateErrorMessage(e)}`;
    }
  }
);

export default Compliance314aSlice;
export const {
  setInitial314AState,
  set314ATablePageNumber,
  set314ATablePageSize,
} = Compliance314aSlice.actions;
