import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  access_token: null,
  isAuthenticated: false,
  UserRole: null,
};

export const authSlice = createSlice({
  name: "auth_token",
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.access_token = action.payload.access_token;
      state.isAuthenticated = true;
      state.UserRole = action.payload.UserRole;
    },
    removeUserToken: (state, action) => {
      state.access_token = null;
      state.isAuthenticated = false;
      state.UserRole = null;
    },
  },
});

export const { setUserToken, removeUserToken } = authSlice.actions;

export default authSlice.reducer;
