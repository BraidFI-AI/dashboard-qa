import ApiClient from "@/core/api/ApiClient";
import {
  CreateAcount,
  CreateForm,
  CustomizableForm,
  CustomizableFormQuestion,
} from "@/core/api/ApiTypes";
import CustomizableFormRepo from "@/core/repos/CustomizableFormRepo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const customizableFormRepo: CustomizableFormRepo = new CustomizableFormRepo(
  apiClient
);

interface CustomizableFormState {
  forms: CustomizableForm[] | null;
}

const initialState: CustomizableFormState = {
  forms: null,
};

const CustomizableFormSlice = createSlice({
  name: "customizableForm",
  initialState,
  reducers: {
    setInitialCustomFormState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchForms.fulfilled, (state, action) => {
      state.forms = action.payload;
    });
  },
});

export const fetchForms = createAsyncThunk(
  "customizableForm/fetchForms",
  async () => {
    try {
      const forms = await customizableFormRepo.fetchForms();
      console.log("forms", forms);
      return forms;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching forms ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const fetchForm = createAsyncThunk(
  "customizableForm/fetchForm",
  async (data: { id: number; version?: number }) => {
    try {
      const form = await customizableFormRepo.fetchForm(data.id, data.version);
      console.log("form", form);
      return form;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching form ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const createForm = createAsyncThunk(
  "customizableForm/createForm",
  async (form: CreateForm) => {
    try {
      await customizableFormRepo.createForm(form);
    } catch (e: any) {
      enqueueSnackbar(`Error fetching form ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const updateQuestion = createAsyncThunk(
  "customizableForm/updateQuestion",
  async (question: CustomizableFormQuestion) => {
    try {
      const resp = await customizableFormRepo.updateQuestion(question);

      return resp;
    } catch (e: any) {
      enqueueSnackbar(`Error fetching question ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const addQuestion = createAsyncThunk(
  "customizableForm/addQuestion",
  async (data: { id: number; question: any }) => {
    try {
      const resp = await customizableFormRepo.addQuestion(
        data.id,
        data.question
      );

      return resp;
    } catch (e: any) {
      enqueueSnackbar(`Error creating question ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }

    return null;
  }
);

export const deleteQuestion = createAsyncThunk(
  "customizableForm/deleteQuestion",
  async (data: { id: number; questionId: number }) => {
    try {
      const resp = await customizableFormRepo.deleteQuestion(
        data.id,
        data.questionId
      );

      return "true";
    } catch (e: any) {
      enqueueSnackbar(`Error deleting question ${generateErrorMessage(e)}`, {
        variant: "error",
        persist: true,
      });
    }
  }
);

export default CustomizableFormSlice;
export const { setInitialCustomFormState } = CustomizableFormSlice.actions;
