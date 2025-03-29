import ApiClient from "@/core/api/ApiClient";
import ReconUploadFileRepo from "@/core/repos/recon_upload_file_repo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const apiClient = ApiClient.getInstance();
const repo: ReconUploadFileRepo = new ReconUploadFileRepo(apiClient);
//
interface ReconFileUploadState {}

const initialState: ReconFileUploadState = {};

const ReconFileUploadSlice = createSlice({
  name: "reconFileUpload",
  initialState,
  reducers: {
    setInitialReconFileUploadState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {},
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

export default ReconFileUploadSlice;
export const { setInitialReconFileUploadState } = ReconFileUploadSlice.actions;
