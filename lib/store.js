import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import watchlistReducer from "./wishlistSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    watchlist: watchlistReducer,
  },
});
