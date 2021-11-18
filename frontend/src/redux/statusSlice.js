import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: "",
  isSubmitQuote: false,
  isSubmitBuy: false,
};

export const statusSlice = createSlice({
  name: "statusSlice",
  initialState,
  reducers: {
    changeStatus(state, action) {
      Object.keys(action.payload).map((name) => {
        return (state[name] = action.payload[name]);
      });
    },
  },
});

export const { changeStatus } = statusSlice.actions;
export default statusSlice.reducer;
