import API from "./axios";

export const loginUser = async (data) => {
  const response = await API.post("/auth/users/login", data);
  console.log(response.data)
  return response.data;
};

