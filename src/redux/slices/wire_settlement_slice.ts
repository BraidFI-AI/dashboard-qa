import ApiClient from "@/core/api/ApiClient";
import { WireReturnFile, WireSettlementHistory } from "@/core/api/ApiTypes";
import WireRepo from "@/core/repos/wire_settlement_repo";
import { momentToTimeZoneString } from "@/core/utils/date_time_util";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment, { Moment } from "moment";

const apiClient = ApiClient.getInstance();
const wireRepo: WireRepo = new WireRepo(apiClient);
//
interface WireState {
  wireSettlementHistory:
    | "initial"
    | "loading"
    | string
    | WireSettlementHistory[];
  wireReturnFiles: "initial" | "loading" | string | WireReturnFile[];
  returnFileStartDate?: string;
  returnFileEndDate?: string;
  productId: number | null;
  productName: number | null;
  startDate: string;
  endDate: string;
}

const initialState: WireState = {
  wireSettlementHistory: "initial",
  wireReturnFiles: "initial",
  productId: null,
  productName: null,
  returnFileStartDate: undefined,
  returnFileEndDate: undefined,
  startDate: momentToTimeZoneString(moment(), true),
  endDate: momentToTimeZoneString(moment(), false),
};

const WireSlice = createSlice({
  name: "wireSettlement",
  initialState,
  reducers: {
    setInitialWireState(state) {
      Object.assign(state, initialState);
    },
    setWireProductId(state, action) {
      state.productId = action.payload;
    },
    setWireProductName(state, action) {
      state.productName = action.payload;
    },
    setWireStartDate(state, action) {
      state.startDate = action.payload;
    },
    setWireEndDate(state, action) {
      state.endDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWireReturnFiles.pending, (state, action) => {
      state.wireReturnFiles = "loading";

      if (
        action.meta.arg?.refresh == null ||
        action.meta.arg.refresh == false
      ) {
        state.returnFileStartDate =
          action.meta.arg?.date?.startDate ?? undefined;
        state.returnFileEndDate = action.meta.arg?.date?.endDate ?? undefined;
      }

      console.log("fetchWireReturnFiles.pending", action.meta.arg);
    });
    builder.addCase(fetchWireReturnFiles.fulfilled, (state, action) => {
      state.wireReturnFiles = action.payload;
    });
    builder.addCase(fetchWireSettlementHistory.pending, (state, action) => {
      state.wireSettlementHistory = "loading";
    });
    builder.addCase(fetchWireSettlementHistory.fulfilled, (state, action) => {
      state.wireSettlementHistory = action.payload;
    });
    builder.addCase(approveWireSettlement.fulfilled, (state, action) => {
      if (
        typeof action.payload != "string" &&
        typeof state.wireSettlementHistory != "string"
      ) {
        const filename = action.payload.filename;
        const updatedFilename = state.wireSettlementHistory.find(
          (e) => e.filename == filename
        );

        if (updatedFilename != undefined) {
          const index = state.wireSettlementHistory.indexOf(updatedFilename);
          state.wireSettlementHistory[index].status = "SENT";
        }
      }
    });
    builder.addCase(approveWireReturnSettlement.fulfilled, (state, action) => {
      if (
        typeof action.payload != "string" &&
        typeof state.wireReturnFiles != "string"
      ) {
        const filename = action.payload.filename;
        const updatedFilename = state.wireReturnFiles.find(
          (e) => e.filename == filename
        );

        if (updatedFilename != undefined) {
          const index = state.wireReturnFiles.indexOf(updatedFilename);
          state.wireReturnFiles[index].status = "SENT";
        }
      }
    });
  },
});

export const fetchWireReturnFiles = createAsyncThunk(
  "wire/fetchWireReturnFiles",
  async (
    data: {
      refresh?: boolean;
      date?: {
        startDate: string;
        endDate: string;
      };
    },
    thunkApi: any
  ) => {
    try {
      let sd = undefined;
      let ed = undefined;

      console.log(
        "wire/fetchWireReturnFiles",
        data,
        thunkApi.getState().wireSettlement
      );

      if (data?.refresh != null && data.refresh) {
        if (
          thunkApi.getState().wireSettlement.returnFileStartDate != null &&
          thunkApi.getState().wireSettlement.returnFileEndDate != null
        ) {
          sd = momentToTimeZoneString(
            moment(thunkApi.getState().wireSettlement.returnFileStartDate),
            true
          );
          ed = momentToTimeZoneString(
            moment(thunkApi.getState().wireSettlement.returnFileEndDate),
            false
          );
        } else {
          return "Please select date range";
        }
      } else if (
        data?.date?.startDate != undefined &&
        data?.date?.endDate != undefined
      ) {
        sd = momentToTimeZoneString(moment(data.date.startDate), true);
        ed = momentToTimeZoneString(moment(data.date.endDate), false);
      } else {
        return "Please select date range";
      }

      const wireSettlementHistory = await wireRepo.fetchWireReturnFiles(sd, ed);
      console.log("wireSettlementHistory", wireSettlementHistory);
      return wireSettlementHistory;
    } catch (e: any) {
      return `Error fetching wire return files ${generateErrorMessage(e)}`;
    }
  }
);

export const downloadWireReturnFile = createAsyncThunk(
  "wire/downloadWireFile",
  async (filename: string) => {
    try {
      await wireRepo.downloadWireReturnFile(filename);
      return "downloaded";
    } catch (e: any) {
      return `Error downloading wire return file! ${generateErrorMessage(e)}`;
    }
  }
);

export const runReturnSettlement = createAsyncThunk(
  "wire/runReturnFile",
  async () => {
    try {
      const resp = await wireRepo.runReturnSettlement();
      console.log("Return settlement ran:", resp);
      return { status: "success" };
    } catch (e: any) {
      return `Error running return settlement ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchWireSettlementHistory = createAsyncThunk(
  "wire/fetchWireSettlementHistory",
  async (
    data: {
      startDate?: Moment;
      endDate?: Moment;
      previous?: boolean;
    },
    thunkApi: any
  ) => {
    try {
      if (data.previous) {
        if (
          thunkApi.getState().wireSettlement.startDate != null &&
          thunkApi.getState().wireSettlement.endDate != null
        ) {
          const wireSettlementHistory =
            await wireRepo.fetchWireSettlementHistory(
              thunkApi.getState().wireSettlement.startDate,
              thunkApi.getState().wireSettlement.endDate
            );
          return wireSettlementHistory;
        } else {
          return "initial";
        }
      } else {
        if (data.startDate != null && data.endDate != null) {
          const wireSettlementHistory =
            await wireRepo.fetchWireSettlementHistory(
              momentToTimeZoneString(data.startDate, true),
              momentToTimeZoneString(data.endDate, false)
            );
          console.log("wireSettlementHistory", wireSettlementHistory);
          return wireSettlementHistory;
        } else {
          return "Please select date range";
        }
      }
    } catch (e: any) {
      return `Error fetching settlement history ${generateErrorMessage(e)}`;
    }
  }
);

export const approveWireSettlement = createAsyncThunk(
  "wire/approveWireSettlement",
  async (filename: string) => {
    try {
      const resp = await wireRepo.approveSettlement(filename);
      console.log("settlement approved:", resp);
      return { filename: filename };
    } catch (e: any) {
      return `Error approving settlement ${generateErrorMessage(e)}`;
    }
  }
);

export const approveWireReturnSettlement = createAsyncThunk(
  "wire/approveWireReturnSettlement",
  async (filename: string) => {
    try {
      const resp = await wireRepo.approveReturnSettlement(filename);
      console.log("Return settlement approved:", resp);
      return { filename: filename };
    } catch (e: any) {
      return `Error approving return settlement ${generateErrorMessage(e)}`;
    }
  }
);

export const downloadWireFile = createAsyncThunk(
  "wire/downloadWireFile",
  async (filename: string) => {
    try {
      await wireRepo.downloadWireSettlementFile(filename);
      return "downloaded";
    } catch (e: any) {
      return `Error downloading wire file! ${generateErrorMessage(e)}`;
    }
  }
);

export const runSettlement = createAsyncThunk(
  "wire/runSettlement",
  async () => {
    try {
      await wireRepo.runSettlement();
      console.log("donining");
      return "done";
    } catch (e: any) {
      return `Error running settlement! ${generateErrorMessage(e)}`;
    }
  }
);

export default WireSlice;
export const {
  setInitialWireState,
  setWireProductId,
  setWireProductName,
  setWireStartDate,
  setWireEndDate,
} = WireSlice.actions;
