import { configureStore } from "@reduxjs/toolkit";
import { quoteSlice } from "./quoteSlice";
import walletReducer from "./walletSlice";
import quoteFormSlice from "./quoteFormSlice";

export default configureStore({
  reducer: {
    wallet: walletReducer,
    quoteForm: quoteFormSlice,
    // quote: quoteSlice,
  },
});
