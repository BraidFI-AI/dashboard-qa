import ApiClient from "@/core/api/ApiClient";
import {
  Counterparty,
  CreateCounterparty,
  SearchCounterparty,
} from "@/core/api/ApiTypes";
import { paginationPageSize } from "@/core/constants";
import CounterpartyRepo from "@/core/repos/CounterpartyRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const counterpartyRepo: CounterpartyRepo = new CounterpartyRepo(apiClient);

interface CounterpartyState {
  counterparties: Counterparty[] | null;
}

const initialState: CounterpartyState = {
  counterparties: null,
};

const CounterpartySlice = createSlice({
  name: "counterparty",
  initialState,
  reducers: {
    setInitialCounterpartyState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {},
});

export const fetchCounterparties = createAsyncThunk(
  "Counterparty/fetchCounterparties",
  async (search: SearchCounterparty) => {
    try {
      const counterparty = await counterpartyRepo.fetchCounterparties(
        search,
        paginationPageSize,
        0
      );
      console.log("counterparty:", counterparty);
      return counterparty;
    } catch (e: any) {
      return `Error fetching counterparty: ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchCounterpartiesPaginated = createAsyncThunk(
  "Counterparty/fetchCounterpartiesPaginated",
  async (params: {
    searchCriteria: SearchCounterparty;
    pageSize: number;
    pageNumber: number;
  }) => {
    try {
      const counterparty = await counterpartyRepo.fetchCounterparties(
        params.searchCriteria,
        params.pageSize,
        params.pageNumber
      );
      console.log(`counterparty page ${params.pageNumber}:`, counterparty);
      return counterparty;
    } catch (e: any) {
      return `Error fetching counterparty: ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchCounterPartyV2 = createAsyncThunk(
  "Counterparty/fetchCounterParty",
  async (id: number) => {
    try {
      const counterparty = await counterpartyRepo.fetchCounterparty(id);
      console.log("counterparty:", counterparty);
      return counterparty;
    } catch (e: any) {
      return `Error fetching counterparty: ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchCounterParty = createAsyncThunk(
  "Counterparty/fetchCounterParty",
  async (id: number) => {
    try {
      const counterparty = await counterpartyRepo.fetchCounterparty(id);
      console.log("counterparty:", counterparty);
      return counterparty;
    } catch (e: any) {
      enqueueSnackbar(
        `Error fetching counterparty: ${generateErrorMessage(e)}`,
        { variant: "error", persist: true }
      );
    }

    return null;
  }
);

export const createCounterparty = createAsyncThunk(
  "Counterparty/createCounterparty",
  async (counterparty: CreateCounterparty) => {
    try {
      if (counterparty.wire != null) {
        if (
          counterparty.wire.intermediaryFIIdNumber == null ||
          counterparty.wire.intermediaryFIIdNumber === ""
        ) {
          counterparty = {
            ...counterparty,
            wire: {
              ...counterparty.wire,
              intermediaryFIIdNumber: undefined,
            },
          };
        }
      }

      const resp = await counterpartyRepo.createCounterparty(counterparty);
      console.log("counterparty created:", resp);
      return resp;
    } catch (e: any) {
      return `Error creating counterparty: ${generateErrorMessage(e)}`;
    }
  }
);

export const updateCounterparty = createAsyncThunk(
  "Counterparty/updateCounterparty",
  async (data: { id: number; counterparty: Counterparty }) => {
    try {
      await counterpartyRepo.updateCounterparty(data.id, data.counterparty);
    } catch (e: any) {
      return `Error updating counterparty: ${generateErrorMessage(e)}`;
    }
  }
);

export default CounterpartySlice;
export const { setInitialCounterpartyState } = CounterpartySlice.actions;
