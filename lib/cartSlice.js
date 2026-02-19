import { createSlice } from "@reduxjs/toolkit";

//create card slice to manage cart state and action
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // array of {id, text, price, ...}
  },
  reducers: {
    //add item to cart or increment quentity if it exists
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },

    //remove item from cart by id
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },

    //update item quentity if item exist and quentity is valid
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item && quantity >= 1) item.quantity = quantity;
    },
  },
});

// export action and reducer for use in the redux store

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
