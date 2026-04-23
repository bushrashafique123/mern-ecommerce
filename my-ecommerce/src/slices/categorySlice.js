import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {getCategory} from '../api/category'

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const data = await getCategory();
    return data;
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
      });
  }
});

export default categorySlice.reducer;