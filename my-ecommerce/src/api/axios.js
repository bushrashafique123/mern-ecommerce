// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");    
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default API;