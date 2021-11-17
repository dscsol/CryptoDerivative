import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  underlying: "BTC",
  quantity: 1,
  period: 1,
  endDate: new Date().toISOString(),
};

export const quoteFormSlice = createSlice({
  name: "quoteFormSlice",
  initialState,
  reducers: {
    changeQuoteForm(state, action) {
      Object.keys(action.payload).map((name) => {
        state[name] = action.payload[name];
      });
    },
  },
});

export const { changeQuoteForm } = quoteFormSlice.actions;
export default quoteFormSlice.reducer;
