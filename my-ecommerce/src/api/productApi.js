import API from "./axios";

export const getProducts = async ({
  page = 1,
  limit = 10,
  search = "",
  sortBy = "createdAt",
  order = "desc"
}) => {
  const response = await API.get("/api/products", {
    params: { page, limit, search, sortBy, order }
  });


  return response.data;
};


export const getProductsByCategory = async (categoryName, page = 1, limit = 10) => {
  const response = await API.get(`/api/products/category/${categoryName}`, {
    params: { page, limit }
  });
  return response.data;
};

