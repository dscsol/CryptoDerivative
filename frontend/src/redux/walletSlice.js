import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  walletAddress: [],
  isLoggedIn: null,
};

export const walletSlice = createSlice({
  name: "walletslice",
  initialState: initialState,
  reducers: {
    addWallet(state, action) {
      state.walletAddress.push(action.payload.toLowerCase());
    },
  },
});

export const { addWallet } = walletSlice.actions;
export default walletSlice.reducer;
