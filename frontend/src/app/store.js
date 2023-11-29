import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { setupListeners } from "@reduxjs/toolkit/query";
import { userAuthApi } from "../services/userAuthApi";
import rootReducer from "./reducer";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(userAuthApi.middleware),
});

export const presistor = persistStore(store);

setupListeners(store.dispatch);
