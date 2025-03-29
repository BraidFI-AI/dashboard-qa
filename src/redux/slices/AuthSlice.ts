import ApiClient, { Method } from "@/core/api/ApiClient";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  token: string;
}

const initialState: AuthState = { token: "" };

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      Cookies.set("token", action.payload, {
        expires: 59 / (24 * 60),
        secure: true,
        sameSite: "strict",
        httpsOnly: true,
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload;
    });
    builder.addCase(logout.fulfilled, () => {});
  },
});

export const logout = createAsyncThunk("auth/logout", async () => {
  const token = Cookies.get("token");
  if (token) {
    ApiClient.getInstance().logout(token);
    Cookies.remove("token");
  }
});

export const login = createAsyncThunk(
  "auth/signin",
  async (data: any, thunkAPI: any) => {
    try {
      const loginData: any = await ApiClient.getInstance().http(
        Method.POST,
        `/authentication`,
        {
          username: data.email,
          password: data.password,
        }
      );
      Cookies.set("token", loginData.token, {
        expires: 59 / (24 * 60),
        secure: true,
        sameSite: "strict",
        httpsOnly: true,
      });

      // thunkAPI.dispatch(initialAccount());
      // thunkAPI.dispatch(initialACH());
      // thunkAPI.dispatch(initialApp());
      // thunkAPI.dispatch(initialBusiness());
      // thunkAPI.dispatch(initialCM());
      // thunkAPI.dispatch(initialCF());
      // thunkAPI.dispatch(initialIndividual());
      // thunkAPI.dispatch(initialProduct());
      // thunkAPI.dispatch(initialProgram());
      // thunkAPI.dispatch(initialTransaction());
      // thunkAPI.dispatch(initialCounterparty());
      // thunkAPI.dispatch(initialDeveloper());
      // thunkAPI.dispatch(initialRulesAndLimits());
      // thunkAPI.dispatch(initialOFAC());

      return loginData.token;
    } catch (loginError: any) {
      if (loginError.code == "ERR_BAD_RESPONSE") {
        //   thunkAPI.dispatch(setSnackbarMessage(`Invalid email or password`));
      } else {
        thunkAPI
          .dispatch
          // setSnackbarMessage(
          //   `An Unknown error occured! Please try logging in again`
          // )
          ();
      }

      // thunkAPI.dispatch(setShowSnackbar());
      return;
    }
  }
);

export default AuthSlice;
export const { setToken } = AuthSlice.actions;
