import ApiClient from "@/core/api/ApiClient";
import { CreateProgram, Program } from "@/core/api/ApiTypes";
import ProgramRepo from "@/core/repos/ProgramRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const programRepo: ProgramRepo = new ProgramRepo(apiClient);

interface ProgramState {
  programs: Program[] | null;
}

const initialState: ProgramState = {
  programs: null,
};

const ProgramSlice = createSlice({
  name: "program",
  initialState,
  reducers: {
    setInitialProgramState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPrograms.fulfilled, (state, action) => {
      state.programs = action.payload;
    });
  },
});

export const fetchPrograms = createAsyncThunk(
  "program/fetchPrograms",
  async () => {
    try {
      const programs = await programRepo.fetchPrograms();
      console.log("programs", programs);
      return programs;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching programs ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const createProgramBaseUrl = createAsyncThunk(
  "program/createProgramBaseUrl",
  async (data: { id: number; url: string }) => {
    try {
      const resp = await programRepo.createProgramBaseUrl(data.id, data.url);

      return resp;
    } catch (e: any) {
      enqueueSnackbar(`Error creating base URL ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchProgram = createAsyncThunk(
  "program/fetchProgram",
  async (programId: number) => {
    try {
      const program = await programRepo.fetchProgram(programId);
      return program;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching program ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const createProgram = createAsyncThunk(
  "program/createProgram",
  async (program: CreateProgram) => {
    try {
      await programRepo.createProgram(program);
    } catch (e: any) {
      enqueueSnackbar(`Error creating program ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const updateProgram = createAsyncThunk(
  "program/updateProgram",
  async (data: { id: number; program: CreateProgram }) => {
    try {
      const resp = await programRepo.updateProgram(data.id, data.program);

      return resp;
    } catch (e: any) {
      enqueueSnackbar(`Error updating program ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchProgramIdsList = createAsyncThunk(
  "program/fetchProgramIdList",
  async () => {
    try {
      const ids = await programRepo.fetchProgramIdsList();
      return ids;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching programs ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchProgramIdsListWithNames = createAsyncThunk(
  "program/fetchProgramIdsListWithNames",
  async () => {
    try {
      const ids = await programRepo.fetchProgramIdsListWithNames();
      return ids;
    } catch (e: any) {
      return `Error fetching programs ${generateErrorMessage(e)}`;
    }
  }
);

export default ProgramSlice;
export const { setInitialProgramState } = ProgramSlice.actions;
