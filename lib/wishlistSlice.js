import { createSlice } from "@reduxjs/toolkit";

//create watchlish slice to manage watchlish state and action
const watchlistSlice = createSlice({
  name: "watchlish",
  initialState: {
    items: [],
  },
  reducers: {
    // add item to watchlist

    addToWatchlist: (state, action) => {
      const item = action.payload;
      if (!state.items.some((existingItem) => existingItem.id === item.id)) {
        state.items.push(item);
      }
    },
    // remove item to watchlist
    removeFromWatchlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

// export action and reducer for use in redux store
export const { addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
