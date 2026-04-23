import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slices/cartSlice";
import productsReducer from '../slices/productSlice';
 import authReducer from '../slices/authSlice.js'
import categoryReducer from '../slices/categorySlice'
import orderReducer from '../slices/orderSlice'


export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    auth: authReducer,
    category:categoryReducer,
    orders:orderReducer,
  },
});


