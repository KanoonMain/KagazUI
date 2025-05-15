import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  lastSignInTime: string | null;
  email: string;
  credits: number;
}

const initialState: AuthState = {
  token: localStorage.getItem("authToken"),
  lastSignInTime: localStorage.getItem("lastSignInTime"),
  email: "",
  credits: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (
      state,
      action: PayloadAction<{ token: string; lastSignInTime: string }>,
    ) => {
      state.token = action.payload.token;
      state.lastSignInTime = action.payload.lastSignInTime;
      localStorage.setItem("authToken", state.token);
      localStorage.setItem("lastSignInTime", state.lastSignInTime);
    },
    setUserData: (
      state,
      action: PayloadAction<{ email: string; credits: number }>,
    ) => {
      state.email = action.payload.email;
      state.credits = action.payload.credits;
    },
    signOut: (state) => {
      state.token = null;
      state.lastSignInTime = null;
      state.email  = "",
      state.credits =  0,
      localStorage.removeItem("authToken");
      localStorage.removeItem("lastSignInTime");
    },
  },
});

export const { signIn, signOut, setUserData } = authSlice.actions;
export default authSlice.reducer;
