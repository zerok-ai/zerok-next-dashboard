// third-party
import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
  TypedUseSelectorHook,
} from "react-redux";

// slices
import authReducer from "./authSlice";
import drawerReducer from "./drawer";
import clusterReducer from "./cluster";
import apiKeysReducer from "./apiKeys";

const reducers = {
  auth: authReducer,
  drawer: drawerReducer,
  cluster: clusterReducer,
  apiKeys: apiKeysReducer,
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

const useDispatch = () => useAppDispatch<AppDispatch>();
const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

export default store;
export { dispatch, useSelector, useDispatch };
