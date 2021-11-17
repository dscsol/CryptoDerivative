import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cost: 0,
  symbol: "",
  expiryDate: "",
};

export const quotePriceSlice = createSlice({
  name: "quotePriceSlice",
  initialState,
  reducers: {
    changeQuotePrice(state, action) {
      Object.keys(action.payload).map((name) => {
        if (name === "expiryDate") {
          state[name] = new Date(action.payload[name]).toISOString();
        } else {
          state[name] = action.payload[name];
        }
      });
    },
  },
});

export const { changeQuotePrice } = quotePriceSlice.actions;
export default quotePriceSlice.reducer;
