import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types/cart";

export interface WishlistItem extends CartItem {}

export interface WishlistState {
  items: WishlistItem[];
}

const loadInitialWishlist = (): WishlistItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("sopifest_wishlist");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveWishlistToStorage = (items: WishlistItem[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("sopifest_wishlist", JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }
};

const initialState: WishlistState = {
  items: loadInitialWishlist(),
};

const wishlistSlice = createSlice({
  name: "watchlist",
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<WishlistItem>) => {
      const item = action.payload;
      if (!state.items.some((existingItem) => existingItem.id === item.id)) {
        state.items.push(item);
      }
      saveWishlistToStorage(state.items);
    },
    removeFromWatchlist: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveWishlistToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },
    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
      saveWishlistToStorage(state.items);
    },
  },
});

export const {
  addToWatchlist,
  removeFromWatchlist,
  clearWishlist,
  setWishlist,
} = wishlistSlice.actions;

// Aliases for clear naming
export const addToWishlist = addToWatchlist;
export const removeFromWishlist = removeFromWatchlist;

export default wishlistSlice.reducer;
