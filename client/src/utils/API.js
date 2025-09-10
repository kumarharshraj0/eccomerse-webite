
import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: "http://localhost:1000/api", // backend base URL
  withCredentials: true, //  send cookies if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); //  store token in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
