import ApiClient from "@/core/api/ApiClient";
import {
  CreateUser,
  User,
  UserResponse,
  WireInbound,
  WireTransactionStatus,
} from "@/core/api/ApiTypes";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import WireProcessingRepo from "@/core/repos/wire_processing_repo";
import WireRepo from "@/core/repos/wire_settlement_repo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { enqueueSnackbar } from "notistack";
import { fetchAlert } from "./alerts_slice";

const apiClient = ApiClient.getInstance();
const wireProcessingRepo: WireProcessingRepo = new WireProcessingRepo(
  apiClient
);

export interface WireProcessingState {
  fileStatusPagination: PaginationStateType;
  transactionsStatus: "loading" | string | WireTransactionStatus[];
}

const initialState: WireProcessingState = {
  transactionsStatus: "loading",
  fileStatusPagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
  },
};

const WireProcessingSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {
    setFileStatusPageNumber(state, action) {
      state.fileStatusPagination.pageNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWireTransactionStatus.pending, (state, action) => {
      if (
        state.fileStatusPagination.pageNumber == -1 ||
        action.meta?.arg?.refresh == true
      ) {
        state.transactionsStatus = "loading";
      }
      state.fileStatusPagination.loadingPage = true;
    });
    builder.addCase(fetchWireTransactionStatus.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.transactionsStatus = action.payload;
      } else {
        state.transactionsStatus = action.payload.transactions;
        state.fileStatusPagination.rowCount = action.payload.rowCount;
        state.fileStatusPagination.pageNumber = action.payload.pageNumber;
      }

      state.fileStatusPagination.loadingPage = false;
    });
  },
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
  }
);

export const getWireFileProcessingError = createAsyncThunk(
  "WireProcessingSlice/getWireFileProcessingError",
  async (id: string, thunkAPI: any) => {
    try {
      const error: any = await wireProcessingRepo.getWireFileProcessingError(
        id
      );

      console.log("wire file error", error);

      return error;
    } catch (e: any) {
      return `Error fetching wire file error ${generateErrorMessage(e)}`;
    }
  }
);

export const updateWireFileRecord = createAsyncThunk(
  "WireProcessingSlice/updateWireFileRecord",
  async (
    data: {
      recordId: string;
      accountNumber: string;
      beneficiaryCode: string;
      alertId: string;
    },
    thunkAPI: any
  ) => {
    try {
      const error: any = await wireProcessingRepo.updateWireFileRecord(data);

      console.log("wire file record updated", error);
      thunkAPI.dispatch(fetchAlert(data.alertId));

      return { fileUpdated: error };
    } catch (e: any) {
      return `Error updating wire file record ${generateErrorMessage(e)}`;
    }
  }
);

export const uploadInboundWireFile = createAsyncThunk(
  "WireProcessingSlice/uploadInboundWireFire",
  async (inbound: string, thunkAPI: any) => {
    try {
      const ib: any = await wireProcessingRepo.uploadInboundWireFile(inbound);

      console.log("Inbound wire processed", ib.errors.join(" "));

      if (ib.wires != null && ib.wires.length > 0) {
        return ib.wires;
      } else {
        return `Error uploading wire file ${ib.errors.join(" ")}`;
      }
    } catch (e: any) {
      return `Error uploading wire file ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchWireTransactionStatus = createAsyncThunk(
  "WireProcessingSlice/fetchWireTransactionStatus",
  async (data: { filename?: string; refresh: boolean }, thunkApi: any) => {
    try {
      const trans = await wireProcessingRepo.fetchWireTransactionStatus(
        paginationPageSize,
        thunkApi.getState().wireProcessing.fileStatusPagination.pageNumber ==
          -1 || data.refresh == true
          ? 0
          : thunkApi.getState().wireProcessing.fileStatusPagination.pageNumber,
        data.filename
      );

      return {
        transactions: trans.content,
        rowCount: trans.totalElements,
        pageNumber: trans.number,
      };
    } catch (e: any) {
      return `Error fetching transactions status! ${generateErrorMessage(e)}`;
    }
  }
);

export default WireProcessingSlice;
export const { setFileStatusPageNumber } = WireProcessingSlice.actions;
