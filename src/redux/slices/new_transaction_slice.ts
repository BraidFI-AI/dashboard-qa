import ApiClient from "@/core/api/ApiClient";
import { ACH } from "@/core/api/ApiTypes";
import { PaginationStateType, paginationPageSize } from "@/core/constants";
import NewTransactionRepo from "@/core/repos/new_transaction_repo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const apiClient = ApiClient.getInstance();
const newTransactionRepo: NewTransactionRepo = new NewTransactionRepo(
  apiClient
);

export type NewTransactionType = "loading" | string | ACH[];

interface NewTransactionState {}

const initialState: NewTransactionState = {};

const NewTransactionSlice = createSlice({
  name: "newTransaction",
  initialState,
  reducers: {
    setInitialNewTransactionState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {},
});

export const adjustmentTransaction = createAsyncThunk(
  "newTransaction/adjustmentTransaction",
  async (
    data: {
      accountNumber: string;
      amount: number;
      direction: string;
      subType: string;
      description: string;
    },
    thunkApi: any
  ) => {
    try {
      const adjustment = await newTransactionRepo.adjustmentTransaction(data);

      console.log("adjustment:", adjustment);
      return adjustment;
    } catch (e: any) {
      console.log("Error creating adjustment transaction:", e);
      return `Error creating adjustment transaction ${generateErrorMessage(e)}`;
    }
  }
);

export const createWireTransaction = createAsyncThunk(
  "newTransaction/wireTransaction",
  async (
    data: {
      amount: number;
      description: string;
      accountNumber: string;
      counterpartyId: string;
      counterpartyType: string;
    },
    thunkApi: any
  ) => {
    try {
      const wire = await newTransactionRepo.createWireTransaction(data);

      console.log("wire:", wire);
      return wire;
    } catch (e: any) {
      console.log("Error creating wire transaction:", e);
      return `Error creating wire transaction ${generateErrorMessage(e)}`;
    }
  }
);

export const transferTransaction = createAsyncThunk(
  "newTransaction/transferTransaction",
  async (
    data: {
      amount: number;
      description: string;
      recipientAccountNumber: string;
      senderAccountNumber: string;
    },
    thunkApi: any
  ) => {
    try {
      const transfer = await newTransactionRepo.transferTransaction(data);

      console.log("transfer:", transfer);
      return transfer;
    } catch (e: any) {
      console.log("Error creating transfer transaction:", e);
      return `Error creating transfer transaction ${generateErrorMessage(e)}`;
    }
  }
);

export default NewTransactionSlice;
export const { setInitialNewTransactionState } = NewTransactionSlice.actions;
