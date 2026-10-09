import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import watchlistReducer from "./wishlistSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    watchlist: watchlistReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
