



import api from "../Api/axiosSetup";

const API_URL = "/Auth"; // relative path, axios baseURL already set

export const registerUser = async (userData) => {
  const response = await api.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post(`${API_URL}/login`, credentials);
  return response.data;
};
