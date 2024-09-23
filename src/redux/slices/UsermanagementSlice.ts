import ApiClient from "@/core/api/ApiClient";
import { CreateUser, User, UserResponse } from "@/core/api/ApiTypes";
import UserMangementRepo from "@/core/repos/UserManagementRepo";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { enqueueSnackbar } from "notistack";

const apiClient = ApiClient.getInstance();
const userMRepo: UserMangementRepo = new UserMangementRepo(apiClient);

export interface UserManagementState {
  users: User[];
  nextToken: string;
  error: boolean;
  errorMessage: string;
  loading: boolean;
}

const initialState: UserManagementState = {
  users: [],
  nextToken: "",
  loading: true,
  error: false,
  errorMessage: "",
};

const UserManagementSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {
    setInitialUsersState(state) {
      Object.assign(state, initialState);
    },
    setUserManagementLoading(state) {
      state.loading = true;
      state.error = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createUser.fulfilled, (state, action: any) => {
      if (typeof action.payload != "string") {
        let dt = moment();
        let dtS =
          dt.year() +
          "-" +
          (dt.month() + 1) +
          "-" +
          dt.date() +
          "T" +
          dt.hours() +
          ":" +
          dt.minute() +
          ":" +
          dt.second() +
          "." +
          dt.millisecond() +
          "Z";

        const u = {
          Enabled: true,
          UserStatus: "FORCE_CHANGE_PASSWORD",
          Username: action.payload.username,
          UserLastModifiedDate: dtS,
          UserCreateDate: dtS,
          Attributes: [
            { Name: "custom:tenantId", Value: action.payload.tenantId },
            {},
            {},
            { Name: "email", Value: action.payload.email },
          ],
        };
        state.users.push(u);
      }
    });
    // builder.addCase(fetchUsers.pending, (state, action) => {
    //   state.loading = true;
    // });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.users && action.payload?.users.length > 0) {
        if (state.users.length > 0) {
          if (
            action.payload?.users.length > 0 &&
            !state.users.find(
              (u: any) => action.payload?.users[0].Username == u.Username
            )
          ) {
            state.users.push(...action.payload.users);
          }
        } else {
          state.users.push(...action.payload.users);
        }
      }
      state.nextToken = action.payload?.nextToken ?? "";
    });
    builder.addCase(fetchUsers.rejected, (state, action: any) => {
      state.users = [];
      state.loading = false;
      state.error = true;
      state.errorMessage = action.error.message;
    });
    builder.addCase(deleteUser.fulfilled, (state, action: any) => {
      state.users = state.users.filter(
        (u: any) => u.Username != action.payload.username
      );
    });
    builder.addCase(enableUser.fulfilled, (state, action: any) => {
      if (action.payload) {
        state.users.forEach((u: User) => {
          if (u.Username == action.payload.username) {
            u.Enabled = true;
          }
        });
      }
    });
    builder.addCase(disableUser.fulfilled, (state, action: any) => {
      if (action.payload) {
        state.users.forEach((u: User) => {
          if (u.Username == action.payload.username) {
            u.Enabled = false;
          }
        });
      }
    });
  },
});

export const createUser = createAsyncThunk(
  "UserManagementState/createUser",
  async (data: CreateUser, thunkAPI: any) => {
    try {
      const user = await userMRepo.createUser(data);
      console.log("user", user);

      thunkAPI.dispatch(fetchUsers(""));

      return data;
    } catch (e: any) {
      let errorMessage = e.response
        ? e.response.status == 409
          ? "Username already exists"
          : e.response.data?.message
        : e.message;
      return "Error creating users: " + errorMessage;
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "UserManagementState/fetchUsers",
  async (token: string, thunkAPI: any) => {
    try {
      const users: UserResponse = await userMRepo.fetchUsers(
        // thunkAPI.getState().userManagement.nextToken
        token
      );
      console.log("users", users);

      if (users._metadata?.paginations?.next != null) {
        thunkAPI.dispatch(fetchUsers(users._metadata.paginations.next));
      }

      return {
        users: users.users,
        nextToken: users._metadata?.paginations?.next ?? "",
      };
    } catch (e: any) {
      let errorMessage = "Error fetching users! ";
      if (e.response?.data?.message) {
        errorMessage += e.response?.data?.message;
      } else {
        errorMessage += e;
      }
      throw Error(errorMessage);
    }

    return null;
  }
);

export const disableUser = createAsyncThunk(
  "UserManagementState/disableUser",
  async (username: string, thunkAPI: any) => {
    try {
      const resp = await userMRepo.disableUser(username);
      console.log("user disabled", username);
      return { username: username };
    } catch (e: any) {
      let errorMessage = "Error disabling user ";
      if (e.response?.data?.message) {
        errorMessage += e.response?.data?.message;
      } else {
        errorMessage += e;
      }
      return errorMessage;
    }
  }
);

export const enableUser = createAsyncThunk(
  "UserManagementState/enableUser",
  async (username: string, thunkAPI: any) => {
    try {
      const resp = await userMRepo.enableUser(username);
      console.log("user enabled", username);
      return { username: username };
    } catch (e: any) {
      let errorMessage = "Error enabling user ";
      if (e.response?.data?.message) {
        errorMessage += e.response?.data?.message;
      } else {
        errorMessage += e;
      }
      return errorMessage;
    }
  }
);

export const resetPassword = createAsyncThunk(
  "UserManagementState/resetPassword",
  async (username: string, thunkAPI: any) => {
    try {
      const resp = await userMRepo.resetPassword(username);
      console.log("reset passowrd", username);
      return { msg: "password reset" };
    } catch (e: any) {
      let errorMessage = "Error resetting password ";
      if (e.response?.data?.message) {
        errorMessage += e.response?.data?.message;
      } else {
        errorMessage += e;
      }
      return errorMessage;
    }
  }
);

export const deleteUser = createAsyncThunk(
  "UserManagementState/deleteUser",
  async (username: string, thunkAPI: any) => {
    try {
      const resp = await userMRepo.deleteUser(username);
      console.log("user deleted", username);
      return { username: username };
    } catch (e: any) {
      let errorMessage = "Error deleting user ";
      if (e.response?.data?.message) {
        errorMessage += e.response?.data?.message;
      } else {
        errorMessage += e;
      }
      return errorMessage;
    }
  }
);

export default UserManagementSlice;
export const { setInitialUsersState, setUserManagementLoading } =
  UserManagementSlice.actions;
