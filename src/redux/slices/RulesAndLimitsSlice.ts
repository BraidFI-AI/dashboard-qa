import ApiClient from "@/core/api/ApiClient";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment, { Moment } from "moment";
import { enqueueSnackbar } from "notistack";
import RulesAndLimitsRepo from "@/core/repos/RulesAndLimitsRepo";
import {
  Business,
  CreateLimit,
  CustomerAccount,
  Individual,
  RulesAndLimits,
} from "@/core/api/ApiTypes";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import BusinessRepo from "@/core/repos/BusinessRepo";
import AccountRepo from "@/core/repos/AccountRepo";
import IndividualRepo from "@/core/repos/IndividualRepo";

const apiClient = ApiClient.getInstance();
const rulesRepo: RulesAndLimitsRepo = new RulesAndLimitsRepo(apiClient);
const businessRepo: BusinessRepo = new BusinessRepo(apiClient);
const individualRepo: IndividualRepo = new IndividualRepo(apiClient);
const accountRepo: AccountRepo = new AccountRepo(apiClient);

export type LimitsType = "loading" | string | RulesAndLimits[];
export type LimitType = "loading" | string | RulesAndLimits;
interface RulesAndLimitsState {
  limits: LimitsType;
  limit: LimitType;
}

const initialState: RulesAndLimitsState = {
  limits: "loading",
  limit: "loading",
};

const LimitsSlice = createSlice({
  name: "limits",
  initialState,
  reducers: {
    setInitialLimitsState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLimits.pending, (state, action) => {
      state.limits = "loading";
    });
    builder.addCase(fetchLimits.fulfilled, (state, action) => {
      state.limits = action.payload;
    });
    builder.addCase(fetchLimit.pending, (state, action) => {
      state.limit = "loading";
    });
    builder.addCase(fetchLimit.fulfilled, (state, action) => {
      state.limit = action.payload;
    });
    builder.addCase(fetchBusinessLimits.pending, (state, action) => {
      state.limits = "loading";
    });
    builder.addCase(fetchBusinessLimits.fulfilled, (state, action) => {
      state.limits = action.payload;
    });
    builder.addCase(fetchIndividualLimits.pending, (state, action) => {
      state.limits = "loading";
    });
    builder.addCase(fetchIndividualLimits.fulfilled, (state, action) => {
      state.limits = action.payload;
    });
    builder.addCase(deactivateLimit.fulfilled, (state, action) => {
      if (typeof action.payload != "string") {
        state.limit = action.payload;
      }
    });
  },
});

export const createLimit = createAsyncThunk(
  "limits/createLimit",
  async (rulesAndLimits: CreateLimit) => {
    try {
      const data = await rulesRepo.createLimit(rulesAndLimits);
      console.log("rule created", data);
      return data;
    } catch (e: any) {
      return `Error creating limit ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchAccountLimits = createAsyncThunk(
  "limits/fetchLimits",
  async (accountId: string) => {
    try {
      let limits: RulesAndLimits[] = [];

      const acc = await accountRepo.fetchAccount(accountId);
      if (acc.productId != null) {
        limits = await rulesRepo.fetchAccountLimits(
          accountId,
          acc.productId ?? 0
        );
      }

      console.log("limits:", limits);

      if (limits.length == 0) {
        return "No limits found";
      } else {
        return limits;
      }
    } catch (e: any) {
      return `Error fetching limit ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchLimits = createAsyncThunk(
  "limits/fetchLimits",
  async (data: { productId?: string; accountId?: string }) => {
    try {
      if (!data.productId && !data.accountId) {
        return "Invalid ID";
      }

      let limits: RulesAndLimits[] = [];
      if (data.productId) {
        limits = await rulesRepo.fetchLimitsByProductId(data.productId);
      } else if (data.accountId) {
        limits = await rulesRepo.fetchLimitsByAccountId(data.accountId);
      } else {
        limits = await rulesRepo.fetchLimits();
      }
      console.log("limits:", limits);

      if (limits.length == 0) {
        return "No limits found";
      } else {
        return limits;
      }
    } catch (e: any) {
      return `Error fetching limit ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchBusinessLimits = createAsyncThunk(
  "limits/fetchBusinessLimits",
  async (id: string) => {
    try {
      const business: Business = await businessRepo.fetchBusiness(parseInt(id));

      const limits: RulesAndLimits[] = [];

      if (business.productId) {
        const prodLimits = await rulesRepo.fetchLimitsByProductId(
          business.productId.toString()
        );

        console.log("business product limits:", prodLimits);
        limits.push(...prodLimits);
      }

      const businessAccounts: CustomerAccount[] =
        await businessRepo.fetchAllBusinessAccounts(business.id);

      const businessAccountLimitsApis: any = [];
      businessAccounts.forEach((acc: CustomerAccount) => {
        businessAccountLimitsApis.push(
          rulesRepo.fetchLimitsByAccountId(acc.accountNumber)
        );
      });

      const accLimits = await Promise.all(businessAccountLimitsApis);
      accLimits.forEach((accLimits: RulesAndLimits[]) => {
        limits.push(...accLimits);
      });

      if (limits.length == 0) {
        return "No limits found";
      } else {
        return limits;
      }
    } catch (e: any) {
      return `Error fetching limits ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchLimit = createAsyncThunk(
  "limits/fetchLimit",
  async (id: string) => {
    try {
      const limit = await rulesRepo.fetchLimit(id);
      console.log("limit:", limit);
      return limit;
    } catch (e: any) {
      return `Error fetching limit ${generateErrorMessage(e)}`;
    }
  }
);

export const deactivateLimit = createAsyncThunk(
  "limits/deactivateLimit",
  async (id: string) => {
    try {
      const limit = await rulesRepo.deactivateLimit(id);
      console.log("limit deactivated:", limit);
      return limit;
    } catch (e: any) {
      return `Error deactivating limit ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchIndividualLimits = createAsyncThunk(
  "limits/fetchIndividualLimits",
  async (id: string) => {
    try {
      const individual: Individual = await individualRepo.fetchIndividual(
        parseInt(id)
      );

      const limits: RulesAndLimits[] = [];

      if (individual.productId) {
        const prodLimits = await rulesRepo.fetchLimitsByProductId(
          individual.productId.toString()
        );

        console.log("individual product limits:", prodLimits);
        limits.push(...prodLimits);
      }

      const individualAccounts: CustomerAccount[] =
        await individualRepo.fetchAllIndividualAccounts(
          individual.id.toString()
        );

      const individualAccountLimitsApis: any = [];
      individualAccounts.forEach((acc: CustomerAccount) => {
        individualAccountLimitsApis.push(
          rulesRepo.fetchLimitsByAccountId(acc.accountNumber)
        );
      });

      const accLimits = await Promise.all(individualAccountLimitsApis);
      accLimits.forEach((accLimits: RulesAndLimits[]) => {
        limits.push(...accLimits);
      });

      console.log("ladlasdladlasld", limits);

      if (limits.length == 0) {
        return "No limits found";
      } else {
        return limits;
      }
    } catch (e: any) {
      return `Error fetching limits ${generateErrorMessage(e)}`;
    }
  }
);

export default LimitsSlice;
export const { setInitialLimitsState } = LimitsSlice.actions;
