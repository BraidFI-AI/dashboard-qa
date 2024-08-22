import ApiClient from "@/core/api/ApiClient";
import { OFAC } from "@/core/api/ApiTypes";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import OFACRepo from "@/core/repos/OFACRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const ofacRepo: OFACRepo = new OFACRepo(apiClient);
//
interface OFACState {
  OFACs: "loading" | string | OFAC[];
  pagination: PaginationStateType;
}

const initialState: OFACState = {
  OFACs: "loading",
  pagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
  },
};

const OFACSlice = createSlice({
  name: "ofac",
  initialState,
  reducers: {
    setInitialOFACState(state) {
      Object.assign(state, initialState);
    },
    setOFACTablePageNumber(state, action) {
      state.pagination.pageNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOFACHits.pending, (state, action) => {
      if (state.pagination.pageNumber == -1 || action.meta.arg == true) {
        state.OFACs = "loading";
      }
      state.pagination.loadingPage = true;
    });
    builder.addCase(fetchOFACHits.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.OFACs = action.payload;
      } else {
        state.OFACs = action.payload.transactions;
        state.pagination.rowCount = action.payload.rowCount;
        state.pagination.pageNumber = action.payload.pageNumber;
      }

      state.pagination.loadingPage = false;
    });
  },
});

export const fetchOFACHits = createAsyncThunk(
  "individual/fetchOFACHits",
  async (refresh: boolean, thunkApi: any) => {
    try {
      const ofacs = await ofacRepo.fetchOFACHits(
        paginationPageSize,
        thunkApi.getState().ofac.pagination.pageNumber == -1 || refresh
          ? 0
          : thunkApi.getState().ofac.pagination.pageNumber
      );
      console.log("OFACs", ofacs);
      return {
        transactions: ofacs.content,
        rowCount: ofacs.totalElements,
        pageNumber: ofacs.number,
      };
    } catch (e: any) {
      return `Error fetching OFAC hits ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchOFACHit = createAsyncThunk(
  "individual/fetchOFACHits",
  async (id: string) => {
    try {
      const ofacs = await ofacRepo.fetchOFACHit(id);
      console.log("OFAC hit", ofacs);
      return ofacs;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching OFAC hit ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const updateOFACHit = createAsyncThunk(
  "individual/updateOFACHit",
  async (data: { id: string; status: string; note: string }) => {
    try {
      const ofacs = await ofacRepo.updateOFACHit(data.id, {
        status: data.status,
        note: data.note,
      });
      console.log("OFAC hit updated", ofacs);
      return ofacs;
    } catch (e: any) {
      return `Error updating OFAC hit ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchOFACHitNew = createAsyncThunk(
  "individual/fetchOFACHitNew",
  async (id: string) => {
    try {
      const ofacs = await ofacRepo.fetchOFACHit(id);
      console.log("OFAC hit", ofacs);
      return ofacs;
    } catch (e: any) {
      return `Error fetching OFAC hit ${generateErrorMessage(e)}`;
    }
  }
);

export default OFACSlice;
export const { setInitialOFACState, setOFACTablePageNumber } =
  OFACSlice.actions;
