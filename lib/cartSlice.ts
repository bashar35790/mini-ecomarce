import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartState } from "@/types/cart";

const loadInitialCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("sopifest_cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("sopifest_cart", JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }
};

const initialState: CartState = {
  items: loadInitialCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existingItem = state.items.find(
        (i) => i.id === item.id && i.variantId === item.variantId
      );
      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (
      state,
      action: PayloadAction<string | number | { id: string | number; variantId?: string }>
    ) => {
      const payload = action.payload;
      if (typeof payload === "object" && payload !== null) {
        state.items = state.items.filter(
          (item) =>
            !(item.id === payload.id && item.variantId === payload.variantId)
        );
      } else {
        state.items = state.items.filter((item) => item.id !== payload);
      }
      saveCartToStorage(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        id: string | number;
        variantId?: string;
        quantity: number;
      }>
    ) => {
      const { id, variantId, quantity } = action.payload;
      const item = state.items.find((i) =>
        variantId ? i.id === id && i.variantId === variantId : i.id === id
      );
      if (item && quantity >= 1) {
        item.quantity = quantity;
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } =
  cartSlice.actions;
export default cartSlice.reducer;
