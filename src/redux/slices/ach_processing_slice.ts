import ApiClient from "@/core/api/ApiClient";
import { ACHFileError, ACHTransactionStatus } from "@/core/api/ApiTypes";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import ACHRepo from "@/core/repos/ACHRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const apiClient = ApiClient.getInstance();
const achRepo: ACHRepo = new ACHRepo(apiClient);

interface ACHPProcessingState {
  fileErrors: "loading" | string | ACHFileError[];
  fileErrorsPagination: PaginationStateType;
  files: "loading" | string | ACHTransactionStatus[];
  filesPagination: PaginationStateType;
}

const initialState: ACHPProcessingState = {
  files: "loading",
  filesPagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
  },
  fileErrors: "loading",
  fileErrorsPagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
  },
};

const ACHProcessingSlice = createSlice({
  name: "processing",
  initialState,
  reducers: {
    setInitialACHProcessingState(state) {
      Object.assign(state, initialState);
    },
    setACHFileErrorsPaginationPageNumber(state, action) {
      state.fileErrorsPagination.pageNumber = action.payload;
    },
    setACHFilesPaginationPageNumber(state, action) {
      state.filesPagination.pageNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchACHTransactionStatus.pending, (state, action) => {
      if (state.filesPagination.pageNumber == -1 || action.meta.arg) {
        state.files = "loading";
      }
      state.filesPagination.loadingPage = true;
    });
    builder.addCase(fetchACHTransactionStatus.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.files = action.payload;
      } else {
        state.files = action.payload.files;
        state.filesPagination.rowCount = action.payload.rowCount;
        state.filesPagination.pageNumber = action.payload.pageNumber;
      }

      state.filesPagination.loadingPage = false;
    });
    builder.addCase(fetchACHFileErrors.pending, (state, action) => {
      if (
        state.fileErrorsPagination.pageNumber == -1 ||
        action.meta.arg.reset
      ) {
        state.fileErrors = "loading";
      }
      state.fileErrorsPagination.loadingPage = true;
    });
    builder.addCase(fetchACHFileErrors.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.fileErrors = action.payload;
      } else {
        state.fileErrors = action.payload.errors;
        state.fileErrorsPagination.rowCount = action.payload.rowCount;
        state.fileErrorsPagination.pageNumber = action.payload.pageNumber;
      }

      state.fileErrorsPagination.loadingPage = false;
    });
  },
});

export const uploadInboundFile = createAsyncThunk(
  "ach/uploadInboundFile",
  async (data: string) => {
    try {
      const filename = await achRepo.uploadInboundFile(data);

      return filename;
    } catch (e: any) {
      return `Error uploading inbound file! ${generateErrorMessage(e)}`;
    }
  }
);

export const uploadOutboundFile = createAsyncThunk(
  "ach/uploadOutboundFile",
  async (data: string) => {
    try {
      const filename = await achRepo.uploadOutboundFile(data);

      return filename;
    } catch (e: any) {
      return `Error uploading outbound file! ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchACHTransactionStatus = createAsyncThunk(
  "ach/fetchACHTransactionStatus",
  async (reset: boolean, thunkApi: any) => {
    try {
      const data = await achRepo.fetchACHTransactionStatus(
        paginationPageSize,
        thunkApi.getState().processing.filesPagination.pageNumber == -1 ||
          reset == true
          ? 0
          : thunkApi.getState().processing.filesPagination.pageNumber
      );

      return {
        files: data.content,
        rowCount: data.totalElements,
        pageNumber: data.number,
      };
    } catch (e: any) {
      return `Error fetching transactions status! ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchACHFileErrors = createAsyncThunk(
  "ach/fetchACHFileErrors",
  async (data: { filename: string; reset?: boolean }, thunkApi: any) => {
    try {
      const errors = await achRepo.fetchACHFileErrors(
        data.filename,
        paginationPageSize,
        thunkApi.getState().processing.fileErrorsPagination.pageNumber == -1 ||
          (data.reset != null && data.reset == true)
          ? 0
          : thunkApi.getState().processing.fileErrorsPagination.pageNumber
      );

      return {
        errors: errors.content,
        rowCount: errors.totalElements,
        pageNumber: errors.number,
      };
    } catch (e: any) {
      return `Error fetching errors! ${generateErrorMessage(e)}`;
    }
  }
);

export default ACHProcessingSlice;
export const {
  setInitialACHProcessingState,
  setACHFileErrorsPaginationPageNumber,
  setACHFilesPaginationPageNumber,
} = ACHProcessingSlice.actions;
