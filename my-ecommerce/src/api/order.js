import API from "./axios";


export const createOrderApi = (data) => API.post("/orders", data);

export const checkoutSessionApi = (data) =>
  API.post("/orders/checkout", data);

export const getOrdersApi = () => API.get("/orders");

export const getSingleOrderApi = (id) =>
  API.get(`/orders/${id}`);