import ApiClient from "@/core/api/ApiClient";
import { ReconAudit } from "@/core/api/ApiTypes";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import ReconUploadFileRepo from "@/core/repos/recon_upload_file_repo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const apiClient = ApiClient.getInstance();
const repo: ReconUploadFileRepo = new ReconUploadFileRepo(apiClient);
//
interface ReconFileUploadState {
  uploadStatus: "loading" | string | ReconAudit[];
  uploadStatusPagination: PaginationStateType;
}

const initialState: ReconFileUploadState = {
  uploadStatus: "loading",
  uploadStatusPagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
    pageSize: paginationPageSize,
  },
};

const ReconFileUploadSlice = createSlice({
  name: "reconFileUpload",
  initialState,
  reducers: {
    setInitialReconFileUploadState(state) {
      Object.assign(state, initialState);
    },
    setUploadStatusPaginationPageNumber(state, action) {
      state.uploadStatusPagination.pageNumber = action.payload;
    },
    setUploadStatusPaginationPageSize(state, action) {
      state.uploadStatusPagination.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUploadStatus.pending, (state, action) => {
      if (
        state.uploadStatusPagination.pageNumber == -1 ||
        action.meta.arg.refresh
      ) {
        state.uploadStatus = "loading";
      }
      state.uploadStatusPagination.loadingPage = true;
    });
    builder.addCase(getUploadStatus.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.uploadStatus = action.payload;
      } else {
        state.uploadStatus = action.payload.content;
        state.uploadStatusPagination.rowCount = action.payload.rowCount;
        state.uploadStatusPagination.pageNumber = action.payload.pageNumber;
      }

      state.uploadStatusPagination.loadingPage = false;
    });
  },
});

export const uploadReconFile = createAsyncThunk(
  "reconFileUpload/uploadReconFile",
  async (data: { file: any; type: "WIRE" | "ACH" }) => {
    try {
      let upload;
      if (data.type == "WIRE") {
        upload = await repo.uploadWireFile(data.file);
      } else {
        upload = await repo.uploadACHFile(data.file);
      }
      console.log("recon file uploaded", upload);
      return upload;
    } catch (e: any) {
      return `Error upload recon file ${generateErrorMessage(e)}`;
    }
  }
);

export const getUploadStatus = createAsyncThunk(
  "reconFileUpload/getUploadStatus",
  async (data: { refresh: boolean }, thunkAPI: any) => {
    try {
      const response: any = await repo.getUploadStatus(
        thunkAPI.getState().reconFileUpload.uploadStatusPagination.pageSize,
        data.refresh
          ? 0
          : thunkAPI.getState().reconFileUpload.uploadStatusPagination
              .pageNumber == -1
          ? 0
          : thunkAPI.getState().reconFileUpload.uploadStatusPagination
              .pageNumber
      );
      console.log("upload status", response);
      return {
        content: response.content,
        rowCount: response.totalElements,
        pageNumber: response.number,
      };
    } catch (e: any) {
      return `Error getting  upload status ${generateErrorMessage(e)}`;
    }
  }
);

export default ReconFileUploadSlice;
export const {
  setInitialReconFileUploadState,
  setUploadStatusPaginationPageNumber,
  setUploadStatusPaginationPageSize,
} = ReconFileUploadSlice.actions;
