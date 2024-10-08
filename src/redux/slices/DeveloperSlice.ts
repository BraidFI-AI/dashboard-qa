import ApiClient from "@/core/api/ApiClient";
import { CreateDeveloper, Developer, WhitelistedIP } from "@/core/api/ApiTypes";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import DeveloperRepo from "@/core/repos/DeveloperRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const developerRepo: DeveloperRepo = new DeveloperRepo(apiClient);

interface DeveloperState {
  developers: Developer[] | null;
  whitelistedIPs: "loading" | string | WhitelistedIP[];
  whitelistedIPsPagination: PaginationStateType;
}

const initialState: DeveloperState = {
  developers: null,
  whitelistedIPs: "loading",
  whitelistedIPsPagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
  },
};

const DeveloperSlice = createSlice({
  name: "developer",
  initialState,
  reducers: {
    setInitialDeveloperState(state) {
      Object.assign(state, initialState);
    },
    setWhitelistedIPsPageNumber(state, action) {
      state.whitelistedIPsPagination.pageNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDevelopers.fulfilled, (state, action) => {
      state.developers = action.payload;
    });
    builder.addCase(fetchDeveloperWhitelistedIPs.pending, (state, action) => {
      if (
        state.whitelistedIPsPagination.pageNumber == -1 ||
        action.meta?.arg?.refresh == true
      ) {
        state.whitelistedIPs = "loading";
      }
      state.whitelistedIPsPagination.loadingPage = true;
    });
    builder.addCase(fetchDeveloperWhitelistedIPs.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.whitelistedIPs = action.payload;
      } else {
        state.whitelistedIPs = action.payload.ips;
        state.whitelistedIPsPagination.rowCount = action.payload.rowCount;
        state.whitelistedIPsPagination.pageNumber = action.payload.pageNumber;
      }

      state.whitelistedIPsPagination.loadingPage = false;
    });
  },
});

export const fetchDevelopers = createAsyncThunk(
  "developer/fetchDevelopers",
  async () => {
    try {
      const developers = await developerRepo.fetchDevelopers();
      console.log("developers", developers);
      return developers;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching developers ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchDevelopersNew = createAsyncThunk(
  "developer/fetchDevelopers",
  async () => {
    try {
      const developers = await developerRepo.fetchDevelopers();
      console.log("developers", developers);
      return developers;
    } catch (e: any) {
      return `Error fetching developers ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchDeveloper = createAsyncThunk(
  "developer/fetchDeveloper",
  async (id: string) => {
    try {
      if (id == null) {
        return;
      }
      const developer = await developerRepo.fetchDeveloper(id);
      return developer;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching developer ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchDeveloperWhitelistedIPs = createAsyncThunk(
  "developer/fetchDeveloperWhitelistedIPs",
  async (data: { id: string; refresh: boolean }, thunkApi: any) => {
    try {
      const ips = await developerRepo.fetchDeveloperWhitelistedIPs(
        data.id,
        paginationPageSize,
        thunkApi.getState().developer.whitelistedIPsPagination.pageNumber ==
          -1 || data.refresh == true
          ? 0
          : thunkApi.getState().developer.whitelistedIPsPagination.pageNumber
      );
      return {
        ips: ips.content,
        rowCount: ips.totalElements,
        pageNumber: ips.number,
      };
    } catch (e: any) {
      return `Error fetching whitelisted IPs ${generateErrorMessage(e)}`;
    }
  }
);

export const whitelistDeveloperIP = createAsyncThunk(
  "developer/whitelistDeveloperIP",
  async (data: { id: string; ip: string }) => {
    try {
      if (data.id == null || data.ip == null) {
        return;
      }
      const developer = await developerRepo.whitelistDeveloperIP(
        data.id,
        data.ip
      );
      return developer;
    } catch (e: any) {
      return `Error whitelisting IPs ${generateErrorMessage(e)}`;
    }
  }
);

export const deleteWhitelistedDeveloperIP = createAsyncThunk(
  "developer/deleteWhitelistedDeveloperIP",
  async (id: string) => {
    try {
      const developer = await developerRepo.deleteWhitelistedDeveloperIP(id);
      return null;
    } catch (e: any) {
      return `Error deleting whitelisted IP ${generateErrorMessage(e)}`;
    }
  }
);

export const createDeveloper = createAsyncThunk(
  "developer/createDeveloper",
  async (developer: CreateDeveloper) => {
    try {
      await developerRepo.createDeveloper(developer);
    } catch (e: any) {
      enqueueSnackbar(`Error creating developer ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchTenetIdsListNew = createAsyncThunk(
  "developer/fetchTenetIdsList",
  async () => {
    try {
      const tenetIds = await developerRepo.fetchTenetIdsList();
      return tenetIds;
    } catch (e: any) {
      return `Error fetching developers ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchTenetIdsList = createAsyncThunk(
  "developer/fetchTenetIdsList",
  async () => {
    try {
      const tenetIds = await developerRepo.fetchTenetIdsList();
      return tenetIds;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching developers ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export default DeveloperSlice;
export const { setInitialDeveloperState, setWhitelistedIPsPageNumber } =
  DeveloperSlice.actions;
