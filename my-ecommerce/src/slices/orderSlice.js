// src/redux/slices/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrderApi,
  checkoutSessionApi,
  getOrdersApi,
} from "../api/order";

export const createOrder = createAsyncThunk(
  "orders/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createOrderApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const createCheckoutSession = createAsyncThunk(
  "orders/checkout",
  async (data, { rejectWithValue }) => {
    try {
      const res = await checkoutSessionApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getOrders = createAsyncThunk(
  "orders/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getOrdersApi();
      return res.data.orders;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    order: null,
    loading: false,
    error: null,
    checkoutSessionId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CREATE ORDER
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.checkoutSessionId = action.payload.id;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  },
});

export default orderSlice.reducer;