import ApiClient from "@/core/api/ApiClient";
import { Alert, AlertSearch } from "@/core/api/ApiTypes";
import { paginationPageSize, PaginationStateType } from "@/core/constants";
import AlertsRepo from "@/core/repos/alerts_repo";
import { generateErrorMessage } from "@/core/utils/exception_utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const alertsRepo: AlertsRepo = new AlertsRepo(apiClient);

interface AlertsState {
  alert: "loading" | string | Alert;
  alerts: "loading" | string | Alert[];
  openAlerts: "loading" | number | string;
  pagination: PaginationStateType;
}

const initialState: AlertsState = {
  alert: "loading",
  alerts: "loading",
  openAlerts: "loading",
  pagination: {
    rowCount: 0,
    pageNumber: -1,
    loadingPage: false,
    pageSize: paginationPageSize,
  },
};

const AlertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    setInitialAlertsState(state) {
      Object.assign(state, initialState);
    },
    setAlertsPaginationPageNumber(state, action) {
      state.pagination.pageNumber = action.payload;
    },
    setAlertsPaginationPageSize(state, action) {
      state.pagination.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAlerts.pending, (state, action) => {
      if (state.pagination.pageNumber == -1) {
        state.alerts = "loading";
      }
      state.pagination.loadingPage = true;
    });
    builder.addCase(fetchAlerts.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.alerts = action.payload;
      } else {
        state.alerts = action.payload.alerts;
        state.pagination.rowCount = action.payload.rowCount;
        state.pagination.pageNumber = action.payload.pageNumber;
      }

      state.pagination.loadingPage = false;
    });
    builder.addCase(fetchAlert.pending, (state, action) => {
      state.alert = "loading";
    });
    builder.addCase(fetchAlert.fulfilled, (state, action) => {
      state.alert = action.payload;
    });
    builder.addCase(fetchOpenAlertsCount.pending, (state, action) => {
      state.openAlerts = "loading";
    });
    builder.addCase(fetchOpenAlertsCount.fulfilled, (state, action) => {
      if (typeof action.payload == "string") {
        state.openAlerts = action.payload;
      } else {
        state.openAlerts = action.payload.allOpenAlerts;
      }
    });
  },
});

export const fetchAlerts = createAsyncThunk(
  "alerts/fetchAlerts",
  async (data: { refresh: boolean; filters: AlertSearch }, thunkApi: any) => {
    try {
      if (
        data.filters.statuses != null &&
        typeof data.filters.statuses == "string"
      ) {
        data.filters.statuses = [data.filters.statuses];
      }

      if (data.filters.types != null && typeof data.filters.types == "string") {
        data.filters.types = [data.filters.types];
      }

      const alerts = await alertsRepo.fetchAlerts(
        thunkApi.getState().alerts.pagination.pageSize ?? paginationPageSize,
        data.refresh == true
          ? 0
          : thunkApi.getState().alerts.pagination.pageNumber == -1
          ? 0
          : thunkApi.getState().alerts.pagination.pageNumber,
        data.filters
      );
      console.log("alerts", alerts);

      return {
        alerts: alerts.content,
        rowCount: alerts.totalElements,
        pageNumber: alerts.number,
      };
    } catch (e: any) {
      return `Error fetching alerts ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchAlert = createAsyncThunk(
  "alerts/fetchAlert",
  async (id: string | number) => {
    try {
      const alert = await alertsRepo.fetchAlert(id);
      console.log("alert", alert);

      return alert;
    } catch (e: any) {
      return `Error fetching alert ${generateErrorMessage(e)}`;
    }
  }
);

export const fetchOpenAlertsCount = createAsyncThunk(
  "alerts/fetchOpenAlertsCount",
  async () => {
    try {
      const count = await alertsRepo.fetchOpenAlertsCount();
      console.log("open alerts count", count);

      return count;
    } catch (e: any) {
      return `Error fetching alerts counts ${generateErrorMessage(e)}`;
    }
  }
);

export const addAlertNote = createAsyncThunk(
  "alerts/addNote",
  async (data: { id: string; note: string }, thunkApi: any) => {
    try {
      const note = await alertsRepo.addAlertNote(data.id, data.note);
      console.log("note added", note);

      thunkApi.dispatch(fetchAlert(data.id));

      return note;
    } catch (e: any) {
      return `Error adding note to alert ${generateErrorMessage(e)}`;
    }
  }
);

export const esclateAlert = createAsyncThunk(
  "alerts/esclateAlert",
  async (
    data: { alertIds: string[]; name: string; description: string },
    thunkApi: any
  ) => {
    try {
      const escalatedAlert = await alertsRepo.esclateAlert(data);
      console.log("alert escalated", escalatedAlert);

      thunkApi.dispatch(fetchAlert(data.alertIds[0]));

      return escalatedAlert;
    } catch (e: any) {
      return `Error esclating alert ${generateErrorMessage(e)}`;
    }
  }
);

export const resolveAlert = createAsyncThunk(
  "alerts/resolveAlert",
  async (
    data: {
      alertId: string;
      action: string;
      note: string;
      whiteList?: {
        ofacId: string;
      };
    },
    thunkApi: any
  ) => {
    try {
      let action = data.action;
      if (data.action.toLowerCase().includes("whitelist")) {
        action = "APPROVE";
      }
      const resolvedAlert = await alertsRepo.resolveAlert({
        alertId: data.alertId,
        action: action.toUpperCase(),
        note: data.note,
      });

      if (
        data.action.toLowerCase().includes("whitelist") &&
        data.whiteList &&
        data.whiteList.ofacId != null
      ) {
        await alertsRepo.whiteListEntity(data.whiteList.ofacId);
      }

      console.log("alert resolve", resolvedAlert);

      thunkApi.dispatch(fetchAlert(data.alertId));

      return resolvedAlert;
    } catch (e: any) {
      return `Error resolving alert ${generateErrorMessage(e)}`;
    }
  }
);

export const createAlertDocument = createAsyncThunk(
  "alerts/createAlertDocument",
  async (
    data: {
      alertId: string;
      description: string;
      documentType: string;
      name: string;
    },
    thunkApi: any
  ) => {
    try {
      const doc = await alertsRepo.createAlertDocument(data);
      console.log("document created", doc);

      return doc;
    } catch (e: any) {
      return `Error creating alert document ${generateErrorMessage(e)}`;
    }
  }
);

export const uploadAlertDocument = createAsyncThunk(
  "business/uploadAlertDocument",
  async (data: { alertId: string; documentId: string; file: File }) => {
    try {
      const doc = await alertsRepo.uploadAlertDocument(
        data.alertId,
        data.documentId,
        { file: data.file }
      );
      console.log("document uploaded:", doc);
      return doc;
    } catch (e: any) {
      return `Error uploading document ${generateErrorMessage(e)}`;
    }
  }
);

export default AlertsSlice;
export const {
  setInitialAlertsState,
  setAlertsPaginationPageNumber,
  setAlertsPaginationPageSize,
} = AlertsSlice.actions;
