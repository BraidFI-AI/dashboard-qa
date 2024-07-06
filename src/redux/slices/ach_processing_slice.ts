import ApiClient from "@/core/api/ApiClient";
import ACHRepo from "@/core/repos/ACHRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const apiClient = ApiClient.getInstance();
const achRepo: ACHRepo = new ACHRepo(apiClient);

interface ACHPProcessingState {}

const initialState: ACHPProcessingState = {};

const ACHProcessingSlice = createSlice({
  name: "processing",
  initialState,
  reducers: {
    setInitialACHProcessingState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {},
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

export default ACHProcessingSlice;
export const { setInitialACHProcessingState } = ACHProcessingSlice.actions;
