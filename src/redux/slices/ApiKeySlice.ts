import ApiClient from "@/core/api/ApiClient";
import ApiKeyRepo from "@/core/repos/ApiKeyRepo";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const apiClient = ApiClient.getInstance();
const apiKeyRepo: ApiKeyRepo = new ApiKeyRepo(apiClient);

export interface ApiKeyState {
  loading: boolean;
  error: string | null;
  apikey: string;
}

const initialState: ApiKeyState = {
  loading: true,
  error: null,
  apikey: "",
};

const ApiKeySlice = createSlice({
  name: "apikey",
  initialState,
  reducers: {
    setInitialApiKeyState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchApiKey.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchApiKey.fulfilled, (state, action) => {
      state.apikey = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchApiKey.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const fetchApiKey = createAsyncThunk("apikey/fetchApiKey", async () => {
  try {
    const apiKey = await apiKeyRepo.fetchApiKey();
    console.log("apikey", apiKey);
    return apiKey.apiKey;
  } catch (e: any) {
    console.log("Error fetching API Key", e);
    let errorMessage = "Error fetching API Key ";
    if (e.response?.data?.message) {
      errorMessage += e.response?.data?.message;
    } else {
      errorMessage += e;
    }
    throw Error(errorMessage);
  }
});

export default ApiKeySlice;
export const { setInitialApiKeyState } = ApiKeySlice.actions;
