
import API from "./axios";

export const fetchCart = async () => {
  const response = await API.get("/api/cart");
  return response.data; 
};


export const addToCart = async (productId, quantity = 1) => {
  const response = await API.post("/api/cart/add", { productId, quantity });
  return response.data;
};

export const removeCartItem = async (productId) => {
  const response = await API.delete(`/api/cart/item/${productId}`);
  return response.data;
};

export const updateCartItem = async (productId, quantity) => {
  const response = await API.patch(`/api/cart/item/${productId}`, { quantity });
  return response.data;
};


export const clearCartItems = async () => {
  const response = await API.delete("/api/cart");
  return response.data;
};