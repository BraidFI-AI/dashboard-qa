import ApiClient from "@/core/api/ApiClient";
import {
  CreateUser,
  User,
  UserResponse,
  WireInbound,
} from "@/core/api/ApiTypes";
import WireProcessingRepo from "@/core/repos/wire_processing_repo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const wireProcessingRepo: WireProcessingRepo = new WireProcessingRepo(
  apiClient
);

export interface WireProcessingState {}

const initialState: WireProcessingState = {};

const WireProcessingSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const processInboundWire = createAsyncThunk(
  "WireProcessingSlice/processInboundWire",
  async (inbound: WireInbound, thunkAPI: any) => {
    try {
      const ib = await wireProcessingRepo.processInboundWire(inbound);
      console.log("Inbound wire processed", ib);
      return ib;
    } catch (e: any) {
      return `Error processing inbound wire ${generateErrorMessage(e)}`;
    }

    return null;
  }
);

export const uploadInboundWireFile = createAsyncThunk(
  "WireProcessingSlice/uploadInboundWireFire",
  async (inbound: string, thunkAPI: any) => {
    try {
      const ib: any = await wireProcessingRepo.uploadInboundWireFile(inbound);
      console.log("Inbound wire processed", ib.errors.join(" "));
      if (ib.errors && ib.errors.length > 0) {
        return `Error uploading wire file ${ib.errors.join(" ")}`;
      } else {
        return ib.wires;
      }
    } catch (e: any) {
      return `Error uploading wire file ${generateErrorMessage(e)}`;
    }
  }
);

export default WireProcessingSlice;
export const {} = WireProcessingSlice.actions;
