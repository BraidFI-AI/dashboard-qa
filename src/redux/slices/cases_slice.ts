import ApiClient from "@/core/api/ApiClient";
import { Case } from "@/core/api/ApiTypes";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import CasesRepo from "@/core/repos/cases_repo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const casesRepo: CasesRepo = new CasesRepo(apiClient);

interface CasesState {
  case: "loading" | string | Case;
  cases: "loading" | string | Case[];
  pagination: PaginationStateType;
}

const initialState: CasesState = {
  case: "loading",
  cases: "loading",
  pagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
  },
};

const CasesSlice = createSlice({
  name: "cases",
  initialState,
  reducers: {
    setInitialCasesState(state) {
      Object.assign(state, initialState);
    },
    setCasesPaginationPageNumber(state, action) {
      state.pagination.pageNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCases.pending, (state, action) => {
      if (state.pagination.pageNumber == -1) {
        state.cases = "loading";
      }
      state.pagination.loadingPage = true;
    });
    builder.addCase(fetchCases.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.cases = action.payload;
      } else {
        state.cases = action.payload.cases;
        state.pagination.rowCount = action.payload.rowCount;
        state.pagination.pageNumber = action.payload.pageNumber;
      }

      state.pagination.loadingPage = false;
    });
    builder.addCase(fetchCase.pending, (state, action) => {
      state.case = "loading";
    });
    builder.addCase(fetchCase.fulfilled, (state, action) => {
      state.case = action.payload;
    });
  },
});

export const fetchCases = createAsyncThunk(
  "cases/fetchCases",
  async (refresh: boolean, thunkApi: any) => {
    try {
      const cases = await casesRepo.fetchCases(
        paginationPageSize,
        refresh == true
          ? 0
          : thunkApi.getState().cases.pagination.pageNumber == -1
          ? 0
          : thunkApi.getState().cases.pagination.pageNumber
      );
      console.log("cases", cases);

      return {
        cases: cases.content,
        rowCount: cases.totalElements,
        pageNumber: cases.number,
      };
    } catch (e: any) {
      return `Error fetching cases ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchCase = createAsyncThunk(
  "cases/fetchCase",
  async (id: string | number) => {
    try {
      const c = await casesRepo.fetchCase(id);
      console.log("case", c);

      return c;
    } catch (e: any) {
      return `Error fetching case ${generateErrorMessage(e)}`;
    }
  }
);

export const resolveCase = createAsyncThunk(
  "cases/resolveCase",
  async (
    data: {
      caseId: string;
      note: string;
      updateAttachedAlerts: boolean;
      action: string;
    },
    thunkApi: any
  ) => {
    try {
      const c = await casesRepo.resolveCase(data);
      console.log("case resolved", c);

      thunkApi.dispatch(fetchCase(data.caseId));

      return c;
    } catch (e: any) {
      return `Error resolving case ${generateErrorMessage(e)}`;
    }
  }
);

export const addCaseNote = createAsyncThunk(
  "cases/addCaseNote",
  async (data: { id: string; note: string }, thunkApi: any) => {
    try {
      const note = await casesRepo.addCaseNote(data.id, data.note);
      console.log("note added", note);

      thunkApi.dispatch(fetchCase(data.id));

      return note;
    } catch (e: any) {
      return `Error adding note to case ${generateErrorMessage(e)}`;
    }
  }
);

export const createCaseDocument = createAsyncThunk(
  "cases/createCaseDocument",
  async (
    data: {
      caseId: string;
      description: string;
      documentType: string;
      name: string;
    },
    thunkApi: any
  ) => {
    try {
      const doc = await casesRepo.createCaseDocument(data);
      console.log("document created", doc);

      return doc;
    } catch (e: any) {
      return `Error creating case document ${generateErrorMessage(e)}`;
    }
  }
);

export const uploadCaseDocument = createAsyncThunk(
  "cases/uploadCaseDocument",
  async (data: { caseId: string; documentId: string; file: File }) => {
    try {
      const doc = await casesRepo.uploadCaseDocument(
        data.caseId,
        data.documentId,
        { file: data.file }
      );
      console.log("document uploaded:", doc);
      return doc;
    } catch (e: any) {
      return `Error uploading document ${generateErrorMessage(e)}`;
    }
  }
);

export default CasesSlice;
export const { setInitialCasesState, setCasesPaginationPageNumber } =
  CasesSlice.actions;
