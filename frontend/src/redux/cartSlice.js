import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    userId: null,
  },

  reducers: {
    setUserCart: (state, action) => {
      const userId = action.payload;
      state.userId = userId;

      const savedCart = localStorage.getItem(`cart_${userId}`);
      state.items = savedCart ? JSON.parse(savedCart) : [];
    },

    addToCart: (state, action) => {
      const item = action.payload;

      const exists = state.items.find((i) => i._id === item._id);
      if (exists) return;

      state.items.push(item);

      localStorage.setItem(`cart_${state.userId}`, JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);

      localStorage.setItem(`cart_${state.userId}`, JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.setItem(`cart_${state.userId}`, JSON.stringify([]));
    },
  },
});

export const { addToCart, removeFromCart, clearCart, setUserCart } =
  cartSlice.actions;

export default cartSlice.reducer;
