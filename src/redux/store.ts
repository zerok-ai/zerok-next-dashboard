import { configureStore } from "@reduxjs/toolkit";
import {
  type TypedUseSelectorHook,
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from "react-redux";

// slices
import authReducer from "./authSlice";
import chatReducer from "./chat";
import clusterReducer from "./cluster";
import drawerReducer from "./drawer";
import flagReducer from "./flags";
import incidentListReducer from "./incidentList";
import snackbarSlice from "./snackbar";

const reducers = {
  auth: authReducer,
  chat: chatReducer,
  drawer: drawerReducer,
  cluster: clusterReducer,
  incidentList: incidentListReducer,
  snackbar: snackbarSlice,
  flag: flagReducer,
};

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

const { dispatch } = store;

const useDispatch = (): AppDispatch => useAppDispatch<AppDispatch>();
const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

export default store;

export { dispatch, useDispatch, useSelector };
