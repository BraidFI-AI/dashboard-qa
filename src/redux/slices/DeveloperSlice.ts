import ApiClient from "@/core/api/ApiClient";
import { CreateDeveloper, Developer } from "@/core/api/ApiTypes";
import DeveloperRepo from "@/core/repos/DeveloperRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const developerRepo: DeveloperRepo = new DeveloperRepo(apiClient);

interface DeveloperState {
  developers: Developer[] | null;
}

const initialState: DeveloperState = {
  developers: null,
};

const DeveloperSlice = createSlice({
  name: "developer",
  initialState,
  reducers: {
    setInitialDeveloperState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDevelopers.fulfilled, (state, action) => {
      state.developers = action.payload;
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
export const { setInitialDeveloperState } = DeveloperSlice.actions;
