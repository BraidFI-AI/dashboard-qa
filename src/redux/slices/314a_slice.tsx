import ApiClient from "@/core/api/ApiClient";
import Compliance314aRepo from "@/core/repos/314a_repo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const repo: Compliance314aRepo = new Compliance314aRepo(apiClient);
//
interface OFACState {}

const initialState: OFACState = {};

const Compliance314aSlice = createSlice({
  name: "314a",
  initialState,
  reducers: {
    setInitialOFACState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {},
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

export default Compliance314aSlice;
export const { setInitialOFACState } = Compliance314aSlice.actions;
