import { configureStore } from "@reduxjs/toolkit";
import { fetcher } from "fetchers/fetcherSlice";
import {
  type TypedUseSelectorHook,
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from "react-redux";

// slices
import authReducer from "./auth/authSlice";
import chatReducer from "./chat/chatSlice";
import clusterReducer from "./cluster";
import drawerReducer from "./drawer";
import incidentListReducer from "./incidentList";
import snackbarSlice from "./snackbar";

const reducers = {
  auth: authReducer,
  chat: chatReducer,
  drawer: drawerReducer,
  cluster: clusterReducer,
  incidentList: incidentListReducer,
  snackbar: snackbarSlice,
  api: fetcher.reducer,
};
const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(fetcher.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

const { dispatch } = store;

const useDispatch = (): AppDispatch => useAppDispatch<AppDispatch>();
const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

export default store;

export { dispatch, useDispatch, useSelector };
