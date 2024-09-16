import ApiClient from "@/core/api/ApiClient";
import { ACH, ReturnRate } from "@/core/api/ApiTypes";
import {
  paginationPageSize,
  PaginationStateType,
  UnauthorisedReturnCodes,
} from "@/core/constants";
import ACHRepo from "@/core/repos/ACHRepo";
import ProductRepo from "@/core/repos/ProductRepo";
import { momentToPSTString } from "@/core/utils/dateTimeUtil";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Moment } from "moment";

const apiClient = ApiClient.getInstance();
const achRepo: ACHRepo = new ACHRepo(apiClient);
const productRepo: ProductRepo = new ProductRepo(apiClient);

export type UnauthorizedReturnsType = "loading" | string | ACH[];
export type ReturnRateType = "idle" | "loading" | string | ReturnRate[];
export type productIdsType =
  | "loading"
  | string
  | { id: string; name: string }[];
interface ACHReturnState {
  unauthorizedReturns: UnauthorizedReturnsType;
  returnRates: ReturnRateType;
  productIds: productIdsType;
  pagination: PaginationStateType;
}

const initialState: ACHReturnState = {
  unauthorizedReturns: "loading",
  returnRates: "idle",
  productIds: "loading",
  pagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
  },
};

const ACHReturnSlice = createSlice({
  name: "return",
  initialState,
  reducers: {
    setInitialACHReturnState(state) {
      Object.assign(state, initialState);
    },
    setUnauthReturnsPaginationPageNumber(state, action) {
      state.pagination.pageNumber = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUnauthorizedReturns.pending, (state, action) => {
      if (state.pagination.pageNumber == -1 || action.meta.arg == true) {
        state.unauthorizedReturns = "loading";
      }
      state.pagination.loadingPage = true;
    });
    builder.addCase(fetchUnauthorizedReturns.fulfilled, (state, action) => {
      console.log(action);
      if (typeof action.payload == "string") {
        state.unauthorizedReturns = action.payload;
      } else {
        state.unauthorizedReturns = action.payload.returns;
        state.pagination.rowCount = action.payload.rowCount;
        state.pagination.pageNumber = action.payload.pageNumber;
      }

      state.pagination.loadingPage = false;
    });
    builder.addCase(fetchReturnRate.pending, (state, action) => {
      state.returnRates = "loading";
    });
    builder.addCase(fetchReturnRate.fulfilled, (state, action) => {
      state.returnRates = action.payload;
    });
    builder.addCase(fetchProductIdsList.pending, (state, action) => {
      state.productIds = "loading";
    });
    builder.addCase(fetchProductIdsList.fulfilled, (state, action) => {
      state.productIds = action.payload;
    });
  },
});

export const fetchReturnRate = createAsyncThunk(
  "ach/fetchReturnRate",
  async (data: {
    startDate: Moment;
    endDate: Moment;
    method: string;
    productId: string | null;
  }) => {
    try {
      const returns = await achRepo.fetchReturnRate(
        momentToPSTString(data.startDate, true),
        momentToPSTString(data.endDate, false),
        data.method
      );

      if (data.productId) {
        const filtered = returns.filter((ret: ReturnRate) => {
          if (ret.productId == data.productId) {
            return true;
          } else {
            return false;
          }
        });
        console.log("filtered returns:", filtered);
        return filtered;
      }

      console.log("returns:", returns);

      return returns;
    } catch (e: any) {
      return `Error fetching return rate! ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchUnauthorizedReturns = createAsyncThunk(
  "ach/fetchUnauthorizedReturns",
  async (refresh: boolean, thunkApi: any) => {
    try {
      const returns = await achRepo.fetchUnauthorizedReturns(
        paginationPageSize,
        refresh != null && refresh == true
          ? 0
          : thunkApi.getState().return.pagination.pageNumber == -1
          ? 0
          : thunkApi.getState().return.pagination.pageNumber
      );

      const filtered: ACH[] = [];

      returns.content.forEach((ret: any) => {
        if (UnauthorisedReturnCodes.includes(ret?.ach?.returnCode ?? "")) {
          filtered.push(ret.ach);
        }
      });

      return {
        returns: filtered,
        rowCount: returns.totalElements,
        pageNumber: returns.number,
      };
    } catch (e: any) {
      return `Error fetching unauthorised returns ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchProductIdsList = createAsyncThunk(
  "product/fetchProductIdsList",
  async () => {
    try {
      const productIds = await productRepo.fetchProductIdsList();
      return productIds;
    } catch (e: any) {
      return `Error fetching products: ${generateErrorMessage(e)}`;
    }
  }
);

export default ACHReturnSlice;
export const {
  setInitialACHReturnState,
  setUnauthReturnsPaginationPageNumber,
} = ACHReturnSlice.actions;
