import ApiClient from "@/core/api/ApiClient";
import { Fees } from "@/core/api/ApiTypes";
import FeeRepo from "@/core/repos/FeeRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const feeRepo: FeeRepo = new FeeRepo(apiClient);

interface FeeState {}

const initialState: FeeState = {};

const FeeSlice = createSlice({
  name: "fees",
  initialState,
  reducers: {
    setInitialFeeState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {},
});

export const fetchFees = createAsyncThunk("fees/fetchFees", async () => {
  try {
    const fees = await feeRepo.fetchFees();
    console.log("fees", fees);
    return fees;
  } catch (e: any) {
    enqueueSnackbar(`Error fetching fees ${generateErrorMessage(e)}`, {
      variant: "error",
      persist: true,
    });
  }

  return null;
});

export const fetchFee = createAsyncThunk(
  "fees/fetchFees",
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

export const fetchFeesByProductId = createAsyncThunk(
  "fees/fetchFfetchFeesByProductIdees",
  async (id: string) => {
    try {
      const fees = await feeRepo.fetchFeesByProductId(id);
      console.log("fees", fees);
      return fees;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching fees ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchFeesByAccountId = createAsyncThunk(
  "fees/fetchFeesByAccountId",
  async (id: string) => {
    try {
      const fees = await feeRepo.fetchFeesByAccountId(id);
      console.log("fees", fees);
      return fees;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching fees ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchFeesByMultipleAccountIds = createAsyncThunk(
  "fees/fetchFeesByMultipleAccountIds",
  async (ids: string[]) => {
    try {
      const fetchFeeAPIs: any = [];
      const fees: Fees[] = [];

      ids.forEach((id: string) => {
        fetchFeeAPIs.push(feeRepo.fetchFeesByAccountId(id));
      });

      const data = await Promise.all(fetchFeeAPIs);
      data.forEach((fee: Fees[]) => {
        fees.push(...fee);
      });

      console.log("fees", fees);
      return fees;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching fees ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const createFee = createAsyncThunk(
  "fees/createFee",
  async (fees: any) => {
    try {
      const fee = await feeRepo.createFee(fees);
      console.log("fees", fee);
      return fee;
    } catch (e: any) {
      enqueueSnackbar(`Error creating fee ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
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
export const { setInitialFeeState } = FeeSlice.actions;
