import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts } from "../api/productApi";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState }) => {
    const { page, limit, search, sortBy, order } = getState().products;

    const data = await getProducts({ page, limit, search, sortBy, order });
    console.log(data)
    return data;
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
  total: 0,
  totalPages: 1,
  page: 1,
  limit: 10,
  search: "",
  sortBy: "createdAt",
  order: "desc"
};

const productSlice = createSlice({
  name: "products",
  initialState,

  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1; // reset page on search
    },

    setSort: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.order = action.payload.order;
    },

    setPage: (state, action) => {
      state.page = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
          state.error = null;
        state.loading = true;
      })
.addCase(fetchProducts.fulfilled, (state, action) => {
  state.loading = false;
  state.products = action.payload.products;
  state.total = action.payload.total;
  state.totalPages = action.payload.totalPages;
})

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setSearch, setSort, setPage } = productSlice.actions;

export default productSlice.reducer;