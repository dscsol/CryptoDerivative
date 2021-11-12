import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./walletSlice";
import quoteFormSlice from "./quoteFormSlice";

export default configureStore({
  reducer: {
    wallet: walletReducer,
    quoteForm: quoteFormSlice,
  },
});
