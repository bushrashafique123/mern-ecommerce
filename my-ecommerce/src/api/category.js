import API from "./axios";

export const getCategory = async (page = 1, limit = 8) => {
  const response = await API.get(`/api/categories?page=${page}&limit=${limit}`);
  return response.data;
};