import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cost: 0,
  symbol: "",
  expiryDate: "",
  maxQty: 1000000,
  minQty: 0.000001,
};

export const quotePriceSlice = createSlice({
  name: "quotePriceSlice",
  initialState,
  reducers: {
    changeQuotePrice(state, action) {
      Object.keys(action.payload).map((name) => {
        if (name === "expiryDate") {
          return (state[name] = new Date(action.payload[name]).toISOString());
        } else {
          return (state[name] = action.payload[name]);
        }
      });
    },
  },
});

export const { changeQuotePrice } = quotePriceSlice.actions;
export default quotePriceSlice.reducer;
