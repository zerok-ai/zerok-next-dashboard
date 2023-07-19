import { configureStore } from "@reduxjs/toolkit";
import {
  type TypedUseSelectorHook,
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from "react-redux";

// slices
import authReducer from "./authSlice";
import clusterReducer from "./cluster";
import drawerReducer from "./drawer";
import incidentListReducer from "./incidentList";

const reducers = {
  auth: authReducer,
  drawer: drawerReducer,
  cluster: clusterReducer,
  incidentList: incidentListReducer,
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
