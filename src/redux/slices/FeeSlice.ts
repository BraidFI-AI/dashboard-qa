import ApiClient from "@/core/api/ApiClient";
import { CreateFee, Fees } from "@/core/api/ApiTypes";
import FeeRepo from "@/core/repos/FeeRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const feeRepo: FeeRepo = new FeeRepo(apiClient);

interface FeeState {
  fees: "loading" | string | Fees[];
  level: "ACCOUNT" | "PRODUCT" | "PROGRAM" | "GLOBAL";
  id: null | string;
  ids: string[];
}

const initialState: FeeState = {
  fees: "loading",
  level: "ACCOUNT",
  id: null,
  ids: [],
};

const FeeSlice = createSlice({
  name: "fees",
  initialState,
  reducers: {
    setInitialFeeState(state) {
      Object.assign(state, initialState);
    },
    setLevel(state, action) {
      state.level = action.payload;
    },
    setId(state, action) {
      state.id = action.payload;
    },
    setIds(state, action) {
      state.ids = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshFees.pending, (state, action) => {
      state.fees = "loading";
    });
    builder.addCase(fetchFeesByProgramId.pending, (state, action) => {
      state.level = "PROGRAM";
      state.id = action.meta.arg;
      state.fees = "loading";
    });
    builder.addCase(fetchFeesByProgramId.fulfilled, (state, action) => {
      state.fees = action.payload;
    });
    builder.addCase(fetchFeesByProductId.pending, (state, action) => {
      state.level = "PRODUCT";
      state.id = action.meta.arg;
      state.fees = "loading";
    });
    builder.addCase(fetchFeesByProductId.fulfilled, (state, action) => {
      state.fees = action.payload;
    });
    builder.addCase(fetchFeesByAccountId.pending, (state, action) => {
      state.level = "ACCOUNT";
      state.id = action.meta.arg;
      state.fees = "loading";
    });
    builder.addCase(fetchFeesByAccountId.fulfilled, (state, action) => {
      state.fees = action.payload;
    });
    builder.addCase(fetchFeesByMultipleAccountIds.pending, (state, action) => {
      state.level = "GLOBAL";
      state.ids = action.meta.arg;
      state.fees = "loading";
    });
    builder.addCase(
      fetchFeesByMultipleAccountIds.fulfilled,
      (state, action) => {
        state.fees = action.payload;
      }
    );
  },
});

export const refreshFees = createAsyncThunk(
  "fees/refreshFees",
  async (_, thunkApi: any) => {
    try {
      if (thunkApi.getState().fee.level == "GLOBAL") {
        thunkApi.dispatch(
          fetchFeesByMultipleAccountIds(thunkApi.getState().fee.ids)
        );
      } else if (thunkApi.getState().fee.level == "PROGRAM") {
        thunkApi.dispatch(fetchFeesByProgramId(thunkApi.getState().fee.id));
      } else if (thunkApi.getState().fee.level == "PRODUCT") {
        thunkApi.dispatch(fetchFeesByProductId(thunkApi.getState().fee.id));
      } else if (thunkApi.getState().fee.level == "ACCOUNT") {
        thunkApi.dispatch(fetchFeesByAccountId(thunkApi.getState().fee.id));
      }
    } catch (e: any) {
      return `Error fetching fees ${generateErrorMessage(e)}`;
    }
  }
);

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

export const fetchFeesByProgramId = createAsyncThunk(
  "fees/fetchFeesByProgramId",
  async (id: string) => {
    try {
      const fees = await feeRepo.fetchFeesByProgramId(id);
      console.log("fees", fees);
      return fees;
    } catch (e: any) {
      return `Error fetching fees ${generateErrorMessage(e)}`;
    }
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
      return `Error fetching fees ${generateErrorMessage(e)}`;
    }
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
      return `Error fetching fees ${generateErrorMessage(e)}`;
    }
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
      return `Error fetching fees ${generateErrorMessage(e)}`;
    }
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
export const { setInitialFeeState } = FeeSlice.actions;
