import ApiClient from "@/core/api/ApiClient";
import { Card } from "@/core/api/ApiTypes";
import CardManagementRepo from "@/core/repos/CardManagementRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const cardsRepo: CardManagementRepo = new CardManagementRepo(apiClient);

interface CardManagementState {
  cards: Card[] | null;
}

const initialState: CardManagementState = {
  cards: null,
};

const CardManagementSlice = createSlice({
  name: "cardManagement",
  initialState,
  reducers: {
    setInitialCardState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCards.fulfilled, (state, action) => {
      state.cards = action.payload;
    });
  },
});

export const fetchCards = createAsyncThunk(
  "cardManagement/fetchCards",
  async () => {
    try {
      const cards = await cardsRepo.fetchCards();
      console.log("cards", cards);
      return cards;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching cards ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchCardsIds = createAsyncThunk(
  "cardManagement/fetchCards",
  async (id: number) => {
    try {
      const cards = await cardsRepo.fetchCardIds(id);
      console.log("cards", cards);
      return cards;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching cards ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchCard = createAsyncThunk(
  "cardManagement/fetchCard",
  async (id: number) => {
    try {
      const card = await cardsRepo.fetchCard(id);
      return card;
    } catch (e: any) {
      // enqueueSnackbar(`Error: ${e.message}`, { variant: "error" });
      enqueueSnackbar(`Error fetching card ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export default CardManagementSlice;
export const { setInitialCardState } = CardManagementSlice.actions;
