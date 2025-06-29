import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setInitialAccountState } from "./AccountSlice";
import { setInitialACHReturnState } from "./ach_return_slice";
import { setInitialACHProcessingState } from "./ach_processing_slice";
import { setInitialACHState } from "./ACHSlice";
import { setInitialApiKeyState } from "./ApiKeySlice";
import { setInitialBusinessState } from "./BusinessSlice";
import { setInitialCardState } from "./CardManagementSlice";
import { setInitialCounterpartyState } from "./CounterpartySlice";
import { setInitialCustomFormState } from "./CustomizableFormSlice";
import { setInitialDeveloperState } from "./DeveloperSlice";
import { setInitialFeeState } from "./FeeSlice";
import { setInitialIndividualState } from "./IndividualSlice";
import { setInitialNOCState } from "./noc_slice";
import { setInitialProductState } from "./ProductSlice";
import { setInitialProgramState } from "./ProgramSlice";
import { setInitialLimitsState } from "./RulesAndLimitsSlice";
import { setInitialTransactionState } from "./TransactionSlice";
import { setInitialUsersState } from "./UsermanagementSlice";
import TransactionRepo from "@/core/repos/TransactionRepo";
import ApiClient from "@/core/api/ApiClient";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { setInitialOFACState } from "./OFACSlice";
import AppRepo from "@/core/repos/app_repo";

const apiClient = ApiClient.getInstance();
const transactionRepo: TransactionRepo = new TransactionRepo(apiClient);
const appRepo: AppRepo = new AppRepo(apiClient);

export type TransactionTypesType = "loading" | string | string[];

interface AppState {
  loading: boolean;
  title: string;
  userType: string | null;
  username: string | null;
  tenantId?: string | null;
  transactionTypes: TransactionTypesType;
  drawerOpen: boolean;
  achReturnCodes: "loading" | string | string[];
  timezone: "loading" | string | { timezone: string };
}

const initialState: AppState = {
  loading: true,
  title: "",
  userType: null,
  username: null,
  transactionTypes: "loading",
  achReturnCodes: "loading",
  tenantId: null,
  drawerOpen: true,
  timezone: "loading",
};

const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUserType(state, action) {
      state.userType = action.payload;
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
    setTenantId(state, action) {
      state.tenantId = action.payload;
    },
    setInitialState(state) {
      Object.assign(state, initialState);
    },
    setTitle(state, action) {
      state.title = action.payload;
    },
    setLoading(state) {
      state.loading = true;
    },
    unsetLoading(state) {
      state.loading = false;
    },
    setDrawerOpen(state) {
      state.drawerOpen = true;
    },
    setDrawerClosed(state) {
      state.drawerOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTimezone.fulfilled, (state, action) => {
      state.timezone = action.payload;
    });
    builder.addCase(resetAppState.fulfilled, (state, action) => {
      Object.assign(state, initialState);
    });
    builder.addCase(fetchTransactionTypes.pending, (state, action) => {
      state.transactionTypes = "loading";
    });
    builder.addCase(fetchTransactionTypes.fulfilled, (state, action) => {
      state.transactionTypes = action.payload;
    });
    builder.addCase(fetchAchReturnCodes.pending, (state, action) => {
      state.achReturnCodes = "loading";
    });
    builder.addCase(fetchAchReturnCodes.fulfilled, (state, action) => {
      state.achReturnCodes = action.payload;
    });
  },
});

export const resetAppState = createAsyncThunk(
  "apikey/resetAppState",
  async (_, thunkApi: any) => {
    thunkApi.dispatch(setInitialAccountState());
    thunkApi.dispatch(setInitialACHProcessingState());
    thunkApi.dispatch(setInitialACHReturnState());
    thunkApi.dispatch(setInitialACHState());
    thunkApi.dispatch(setInitialApiKeyState());
    thunkApi.dispatch(setInitialBusinessState());
    thunkApi.dispatch(setInitialCardState());
    thunkApi.dispatch(setInitialCounterpartyState());
    thunkApi.dispatch(setInitialCustomFormState());
    thunkApi.dispatch(setInitialDeveloperState());
    thunkApi.dispatch(setInitialFeeState());
    thunkApi.dispatch(setInitialIndividualState());
    thunkApi.dispatch(setInitialNOCState());
    thunkApi.dispatch(setInitialOFACState());
    thunkApi.dispatch(setInitialProductState());
    thunkApi.dispatch(setInitialProgramState());
    thunkApi.dispatch(setInitialLimitsState());
    thunkApi.dispatch(setInitialTransactionState());
    thunkApi.dispatch(setInitialUsersState());
  }
);

export const fetchTimezone = createAsyncThunk(
  "app/fetchTimezone",
  async (_, thunkApi: any) => {
    try {
      const timezone: any = await appRepo.fetchTimezone();
      return { timezone: timezone.timeZone };
    } catch (err: any) {
      return `Error fetching timezone ${generateErrorMessage(err)}`;
    }
  }
);

export const fetchTransactionTypes = createAsyncThunk(
  "app/fetchTransactionTypes",
  async (_, thunkApi: any) => {
    try {
      const transTypes = await transactionRepo.fetchTransactionTypes();
      console.log("transaction types:", transTypes);
      return transTypes;
    } catch (err: any) {
      return `Error fetching transaction types ${generateErrorMessage(err)}`;
    }
  }
);

export const fetchAchReturnCodes = createAsyncThunk(
  "app/fetchAchReturnCodes",
  async (_, thunkApi: any) => {
    try {
      const transTypes = await transactionRepo.fetchAchReturnCodes();
      console.log("ach return codes:", transTypes);
      return transTypes;
    } catch (err: any) {
      return `Error fetching ach return codes ${generateErrorMessage(err)}`;
    }
  }
);

export default AppSlice;
export const {
  setTenantId,
  setUserType,
  setUsername,
  setTitle,
  setInitialState,
  setLoading,
  unsetLoading,
  setDrawerOpen,
  setDrawerClosed,
} = AppSlice.actions;
