import ApiClient from "@/core/api/ApiClient";
import { OFAC } from "@/core/api/ApiTypes";
import OFACRepo from "@/core/repos/OFACRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const ofacRepo: OFACRepo = new OFACRepo(apiClient);
//
interface OFACState {
  OFACs: OFAC[] | null;
}

const initialState: OFACState = {
  OFACs: null,
};

const OFACSlice = createSlice({
  name: "ofac",
  initialState,
  reducers: {
    setInitialOFACState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOFACHits.fulfilled, (state, action) => {
      state.OFACs = action.payload;
    });
  },
});

export const fetchOFACHits = createAsyncThunk(
  "individual/fetchOFACHits",
  async () => {
    try {
      const ofacs = await ofacRepo.fetchOFACHits();
      console.log("OFACs", ofacs);
      return ofacs;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching OFAC hits ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
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
export const { setInitialOFACState } = OFACSlice.actions;
