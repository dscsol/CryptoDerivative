import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./walletSlice";
import quoteFormSlice from "./quoteFormSlice";
import quotePriceSlice from "./quotePriceSlice";
import statusSlice from "./statusSlice";

export default configureStore({
  reducer: {
    wallet: walletReducer,
    quoteForm: quoteFormSlice,
    quotePrice: quotePriceSlice,
    status: statusSlice,
  },
});
