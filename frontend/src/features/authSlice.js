import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  access_token: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth_token",
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.access_token = action.payload.access_token;
      state.isAuthenticated = true;
    },
    removeUserToken: (state, action) => {
      state.access_token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUserToken, removeUserToken } = authSlice.actions;

export default authSlice.reducer;
