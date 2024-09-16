import ApiClient from "@/core/api/ApiClient";
import { ACHSettlementHistory } from "@/core/api/ApiTypes";
import ACHRepo from "@/core/repos/ACHRepo";
import { momentToPSTString } from "@/core/utils/dateTimeUtil";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment, { Moment } from "moment";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const achRepo: ACHRepo = new ACHRepo(apiClient);

interface ACHState {
  achSettlementHistory: "loading" | string | ACHSettlementHistory[];
  productId?: string;
  startDate?: string;
  endDate?: string;
}

const initialState: ACHState = {
  achSettlementHistory: "loading",
  productId: undefined,
  startDate: undefined,
  endDate: undefined,
};

const ACHSlice = createSlice({
  name: "ach",
  initialState,
  reducers: {
    setInitialACHState(state) {
      Object.assign(state, initialState);
    },
    clearACHHistory(state) {
      state.achSettlementHistory = "loading";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchACHSettlementHistory.pending, (state, action) => {
      if (
        state.productId == action.meta.arg?.productId &&
        state.startDate == action.meta.arg?.date?.startDate &&
        state.endDate == action.meta.arg?.date?.endDate
      ) {
        return;
      }

      state.achSettlementHistory = "loading";

      state.productId = action.meta.arg?.productId ?? undefined;
      state.startDate = action.meta.arg?.date?.startDate ?? undefined;
      state.endDate = action.meta.arg?.date?.endDate ?? undefined;

      console.log(action.meta.arg);
    });
    builder.addCase(fetchACHSettlementHistory.fulfilled, (state, action) => {
      state.achSettlementHistory = action.payload;
    });
    builder.addCase(approveSettlement.fulfilled, (state, action) => {
      if (
        action.payload != null &&
        typeof state.achSettlementHistory != "string"
      ) {
        const filename = action.payload;
        const updatedFilename = state.achSettlementHistory.find(
          (e) => e.filename == filename
        );

        if (updatedFilename != undefined) {
          const index = state.achSettlementHistory.indexOf(updatedFilename);
          state.achSettlementHistory[index].status = "SENT";
        }
      }
    });
    builder.addCase(downloadACHFile.fulfilled, () => {});
  },
});

export const sendFileToSFTP = createAsyncThunk(
  "ach/sendFileToSFTP",
  async (filename: string) => {
    try {
      const resp = await achRepo.sendFileToSFTP(filename);
      console.log("settlement file sent to sftp:", resp);
      return { filename: filename };
    } catch (e: any) {
      return `Error sending file to SFTP the settlement ${generateErrorMessage(
        e
      )}`;
    }
  }
);

export const approveSettlement = createAsyncThunk(
  "ach/approveSettlement",
  async (data: { productId: number; filename: string }) => {
    try {
      const resp = await achRepo.approveSettlement(
        data.productId,
        data.filename
      );
      console.log("settlement approved:", resp);
      return data.filename;
    } catch (e: any) {
      console.log("error approving the settlement", e);
      enqueueSnackbar(`Error approving settlement ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
      return null;
    }
  }
);

export const downloadACHFile = createAsyncThunk(
  "ach/downloadACHFile",
  async (data: { productId: number; filename: string }) => {
    try {
      await achRepo.downloadACHFile(data.productId, data.filename);
      return "downloaded";
    } catch (e: any) {
      return `Error downloading ach file! ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchACHSettlementHistory = createAsyncThunk(
  "ach/fetchACHSettlementHistory",
  async (data?: {
    productId?: string;
    date?: {
      startDate: string;
      endDate: string;
    };
  }) => {
    try {
      let sd = undefined;
      let ed = undefined;

      if (
        data?.date?.startDate != undefined &&
        data?.date?.endDate != undefined
      ) {
        sd = momentToPSTString(moment(data.date.startDate), true);
        ed = momentToPSTString(moment(data.date.endDate), false);
      }

      const achSettlementHistory = await achRepo.fetchACHSettlementHistory(
        data?.productId,
        sd,
        ed
      );
      console.log("achSettlementHistory", achSettlementHistory);
      return achSettlementHistory;
    } catch (e: any) {
      return `Error fetching settlement history ${generateErrorMessage(e)}`;
    }
  }
);

export default ACHSlice;
export const { setInitialACHState, clearACHHistory } = ACHSlice.actions;
