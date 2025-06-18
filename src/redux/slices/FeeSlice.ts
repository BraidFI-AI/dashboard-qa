import ApiClient from "@/core/api/ApiClient";
import { CreateFee, FeeSearch, Fees } from "@/core/api/ApiTypes";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import FeeRepo from "@/core/repos/FeeRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const feeRepo: FeeRepo = new FeeRepo(apiClient);

interface FeeState {
  fees: "loading" | string | Fees[];
  search: FeeSearch;
  pagination: PaginationStateType;
}

const initialState: FeeState = {
  fees: "loading",
  search: {},
  pagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
    pageSize: paginationPageSize,
  },
};

const FeeSlice = createSlice({
  name: "fees",
  initialState,
  reducers: {
    setInitialFeeState(state) {
      Object.assign(state, initialState);
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setFeePaginationPageSize(state, action) {
      state.pagination.pageSize = action.payload;
    },
    setFeePaginationPageNumber(state, action) {
      state.pagination.pageNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(feeSearch.pending, (state, action) => {
      if (state.pagination.pageNumber == -1) {
        state.fees = "loading";
      }
      state.pagination.loadingPage = true;
      state.search = action.meta.arg?.search ?? state.search;
    });
    builder.addCase(feeSearch.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.fees = action.payload;
      } else {
        state.fees = action.payload.fees;
        state.pagination.rowCount = action.payload.rowCount;
        state.pagination.pageNumber = action.payload.pageNumber;
      }

      state.pagination.loadingPage = false;
    });
  },
});

export const feeSearch = createAsyncThunk(
  "fees/feeSearch",
  async (
    data: { search: FeeSearch; refresh: boolean } | undefined,
    thunkApi: any
  ) => {
    try {
      const fees = await feeRepo.feeSearch(
        data?.search ?? thunkApi.getState().fee.search,
        thunkApi.getState().fee.pagination.pageSize ?? paginationPageSize,
        thunkApi.getState().fee.pagination.pageNumber == -1
          ? 0
          : thunkApi.getState().fee.pagination.pageNumber
      );
      console.log("fees", fees);
      return {
        fees: fees.content,
        rowCount: fees.totalElements,
        pageNumber: fees.number,
        search: data?.search ?? thunkApi.getState().fee.search,
      };
    } catch (e: any) {
      return `Error fetching fees ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchFee = createAsyncThunk(
  "fees/fetchFee",
  async (id: string) => {
    try {
      const fee = await feeRepo.fetchFee(id);
      console.log("fee", fee);
      return fee;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching fee ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const createFee = createAsyncThunk(
  "fees/createFee",
  async (fees: CreateFee) => {
    try {
      const fee = await feeRepo.createFee(fees);
      console.log("fees", fee);
      return fee;
    } catch (e: any) {
      return `Error creating fee ${generateErrorMessage(e)}`;
    }
  }
);

export const updateFee = createAsyncThunk(
  "fees/updateFee",
  async (fees: any) => {
    try {
      const fee = await feeRepo.updateFee(fees);
      console.log("fees", fee);
      return fee;
    } catch (e: any) {
      enqueueSnackbar(`Error updating fee ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
      // enqueueSnackbar(`Error updating fees ${e}`);
    }

    return null;
  }
);

export const deleteFee = createAsyncThunk(
  "fees/deleteFee",
  async (id: string) => {
    try {
      const fee = await feeRepo.deleteFee(id);
      return "deleted";
    } catch (e: any) {
      enqueueSnackbar(`Error deleting fee ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export default FeeSlice;
export const {
  setInitialFeeState,
  setFeePaginationPageSize,
  setFeePaginationPageNumber,
} = FeeSlice.actions;
