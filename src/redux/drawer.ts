import { createSlice } from "@reduxjs/toolkit";

import { type RootState } from "./store";
import { type DrawerReduxType } from "./types";

const initialState: DrawerReduxType = {
  isDrawerMinimized: false,
  activeLink: null,
};

export const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    minimizeDrawer: (state) => {
      state.isDrawerMinimized = true;
    },
    maximizeDrawer: (state) => {
      state.isDrawerMinimized = false;
    },
    toggleDrawer: (state) => {
      const old = state.isDrawerMinimized;
      state.isDrawerMinimized = !old;
    },
  },
});

// Action creators are generated for each case reducer function
export const { minimizeDrawer, maximizeDrawer, toggleDrawer } =
  drawerSlice.actions;

export const drawerSelector = (state: RootState): DrawerReduxType =>
  state.drawer;

export default drawerSlice.reducer;
