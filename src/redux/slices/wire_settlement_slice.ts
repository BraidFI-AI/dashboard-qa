import ApiClient from "@/core/api/ApiClient";
import { WireSettlementHistory } from "@/core/api/ApiTypes";
import WireRepo from "@/core/repos/wire_settlement_repo";
import { momentToPSTString } from "@/core/utils/dateTimeUtil";
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

  productId: number | null;
  productName: number | null;
  startDate: string;
  endDate: string;
}

const initialState: WireState = {
  wireSettlementHistory: "initial",
  productId: null,
  productName: null,
  startDate: momentToPSTString(moment(), true),
  endDate: momentToPSTString(moment(), false),
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
  },
});

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
              momentToPSTString(data.startDate, true),
              momentToPSTString(data.endDate, false)
            );
          console.log("wireSettlementHistory", wireSettlementHistory);
          return wireSettlementHistory;
        } else {
          return "Please select a product and date range";
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
