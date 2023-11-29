import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../features/authSlice";
import { userAuthApi } from "../services/userAuthApi";

const rootReducer = combineReducers({
  auth: authReducer,
  [userAuthApi.reducerPath]: userAuthApi.reducer,
});

export default rootReducer;
