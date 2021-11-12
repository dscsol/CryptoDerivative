import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  underlying: "BTC",
  quantity: 1,
  period: 1,
  endDate: new Date().toISOString(0),
};

export const quoteFormSlice = createSlice({
  name: "quoteFormSlice",
  initialState,
  reducers: {
    changeFormQuote(state, action) {
      Object.keys(action.payload).map((name) => {
        state[name] = action.payload[name];
      });
    },
  },
});

export const { changeFormQuote } = quoteFormSlice.actions;
export default quoteFormSlice.reducer;
