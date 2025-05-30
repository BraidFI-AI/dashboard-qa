import ApiClient from "@/core/api/ApiClient";
import EncryptionRepo from "@/core/repos/encryption_repo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const apiClient = ApiClient.getInstance();
const encryptionRepo: EncryptionRepo = new EncryptionRepo(apiClient);

export interface EncryptionSliceState {
  data: "loading" | string | {};
}

const initialState: EncryptionSliceState = {
  data: "loading",
};

const EncryptionSlice = createSlice({
  name: "encryption",
  initialState,
  reducers: {
    setInitialEncryptionState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {},
});

export const decrypt = createAsyncThunk(
  "encryption/decrypt",
  async (data: any) => {
    try {
      const decryptedData = await encryptionRepo.decrypt(data);
      console.log("decrypted data", decryptedData);
      return { data: decryptedData };
    } catch (e: any) {
      return `Error decrypting data ${generateErrorMessage(e)}`;
    }
  }
);

export default EncryptionSlice;
export const { setInitialEncryptionState } = EncryptionSlice.actions;
