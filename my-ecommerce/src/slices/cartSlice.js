// src/slices/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCart,
  addToCart,
  removeCartItem,
  updateCartItem,
  clearCartItems,
} from "../api/cart";

const initialState = {
  cartItems: [],
  status: "idle",
  error: null,
};

export const fetchCarts = createAsyncThunk(
  "cart/fetchCarts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchCart();
      return response; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await addToCart(productId, quantity);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await removeCartItem(productId);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await updateCartItem(productId, quantity);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clearCartItems();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCarts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = action.payload.items || [];
      })
      .addCase(fetchCarts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addItemToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = action.payload.items || [];
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(removeItemFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = action.payload.items || [];
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = action.payload.items || [];
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(clearCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.status = "succeeded";
        state.cartItems = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;