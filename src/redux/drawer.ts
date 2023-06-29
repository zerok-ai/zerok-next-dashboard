import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

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
  },
});

// Action creators are generated for each case reducer function
export const { minimizeDrawer, maximizeDrawer } = drawerSlice.actions;
export const drawerSelector = (state: RootState) => state.drawer;

export default drawerSlice.reducer;
