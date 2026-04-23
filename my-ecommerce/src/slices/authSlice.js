import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "@/api/authApi";

export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
  
    try {
      const response = await loginUser(userData);
  
      return response;
    } catch (err) {
      console.error("API error:", err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
const token = localStorage.getItem("token");
const initialState = {
   user: null,
  token: token || null,
  loading: false,
  error: null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;