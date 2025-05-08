import ApiClient from "@/core/api/ApiClient";
import { paginationPageSize } from "@/core/constants";
import VelocityLimitRepo from "@/core/repos/velocity_limit_repo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { VelocityLimit, VelocityLimitFilters } from "@/core/api/ApiTypes";

const apiClient = ApiClient.getInstance();
const velocityLimitRepo: VelocityLimitRepo = new VelocityLimitRepo(apiClient);

interface VelocityLimitState {
  limitsPagination: {
    rowCount: 0;
    pageNumber: number;
    loadingPage: boolean;
    pageSize: number;
  };
  limits: "loading" | string | VelocityLimit[];
}

const initialState: VelocityLimitState = {
  limits: "loading",
  limitsPagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
    pageSize: paginationPageSize,
  },
};

const VelocityLimitSlice = createSlice({
  name: "velocityLimit",
  initialState,
  reducers: {
    setInitialVelocityLimitState(state) {
      Object.assign(state, initialState);
    },
    setLimitsPageSize(state, action) {
      state.limitsPagination.pageSize = action.payload;
    },
    setLimitsPageNumber(state, action) {
      state.limitsPagination.pageNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVelocityLimits.pending, (state, action) => {
      if (state.limitsPagination.pageNumber == -1 || action.meta.arg.refresh) {
        state.limits = "loading";
      }
      state.limitsPagination.loadingPage = true;
    });
    builder.addCase(fetchVelocityLimits.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.limits = action.payload;
      } else {
        state.limits = action.payload.limits;
        state.limitsPagination.rowCount = action.payload.rowCount;
        state.limitsPagination.pageNumber = action.payload.pageNumber;
      }

      state.limitsPagination.loadingPage = false;
    });
  },
});

export const fetchVelocityLimits = createAsyncThunk(
  "velocityLimit/fetchVelocityLimits",
  async (
    data: { refresh: boolean; filters: VelocityLimitFilters },
    thunkApi: any
  ) => {
    try {
      // if (data.filters.createdAtStart) {
      //   const sDate = moment(data.filters.createdAtStart);
      //   data.filters = {
      //     ...data.filters,
      //     createdAtStart: `${sDate.year()}-${(sDate.month() + 1)
      //       .toString()
      //       .padStart(2, "0")}-${sDate.date().toString().padStart(2, "0")}`,
      //   };
      // }
      // if (data.filters.createdAtEnd) {
      //   const sDate = moment(data.filters.createdAtEnd);
      //   data.filters = {
      //     ...data.filters,
      //     createdAtEnd: `${sDate.year()}-${(sDate.month() + 1)
      //       .toString()
      //       .padStart(2, "0")}-${sDate.date().toString().padStart(2, "0")}`,
      //   };
      // }

      const limits = await velocityLimitRepo.fetchVelocityLimits(
        thunkApi.getState().velocityLimit.limitsPagination.pageSize ??
          paginationPageSize,
        data.refresh == true
          ? 0
          : thunkApi.getState().velocityLimit.limitsPagination.pageNumber == -1
          ? 0
          : thunkApi.getState().velocityLimit.limitsPagination.pageNumber
        // data.filters
      );
      console.log("velocity limits", limits);

      return {
        limits: limits.content,
        rowCount: limits.totalElements,
        pageNumber: limits.number,
      };
    } catch (e: any) {
      return `Error fetching velocity limits ${generateErrorMessage(e)}`;
    }
  }
);

export const createReceiverMatchLimit = createAsyncThunk(
  "velocityLimit/createReceiverMatchLimit",
  async (
    data: {
      limitName: string;
      programId: string;
      volume: number;
      action: string;
    },
    thunkApi: any
  ) => {
    try {
      const response = await velocityLimitRepo.createReceiverMatchLimit(data);
      return response;
    } catch (e: any) {
      return `Error creating velocity limit ${generateErrorMessage(e)}`;
    }
  }
);

export const createRoundedNumberLimit = createAsyncThunk(
  "velocityLimit/createRoundedNumberLimit",
  async (
    data: {
      limitName: string;
      programId: string;
      volume: number;
      action: string;
      transactionGroups?: string[];
      transactionTypes?: string[];
    },
    thunkApi: any
  ) => {
    try {
      const response = await velocityLimitRepo.createRoundedNumberLimit(data);
      return response;
    } catch (e: any) {
      return `Error creating velocity limit ${generateErrorMessage(e)}`;
    }
  }
);

export const createTransactionLimit = createAsyncThunk(
  "velocityLimit/createTransactionLimit",
  async (
    data: {
      limitName: string;
      volume?: number;
      aggregationDays?: string;
      frequencyMax?: string;
      aggregationLevel: string;
      associatedEntityType: string;
      associatedEntityId?: string;
      action: string;
      transactionGroups?: string[];
      transactionTypes?: string[];
      restrictedEntities?: {
        entityType: string;
        entityName: string;
        entityCode?: string;
      }[];
    },
    thunkApi: any
  ) => {
    try {
      const response = await velocityLimitRepo.createTransactionLimit(data);
      return response;
    } catch (e: any) {
      return `Error creating velocity limit ${generateErrorMessage(e)}`;
    }
  }
);

export const getRestrictedEntities = createAsyncThunk(
  "velocityLimit/getRestrictedEntities",
  async () => {
    try {
      const response = await velocityLimitRepo.getRestrictedEntities();
      return response;
    } catch (e: any) {
      return `Error getting restricted entities ${generateErrorMessage(e)}`;
    }
  }
);

export const deactivateVelocityLimit = createAsyncThunk(
  "velocityLimit/deactivateVelocityLimit",
  async (limitId: string) => {
    try {
      const response = await velocityLimitRepo.deactivateVelocityLimit(limitId);
      return response;
    } catch (e: any) {
      return `Error deactivating velocity limit ${generateErrorMessage(e)}`;
    }
  }
);

export default VelocityLimitSlice;
export const {
  setInitialVelocityLimitState,
  setLimitsPageSize,
  setLimitsPageNumber,
} = VelocityLimitSlice.actions;
