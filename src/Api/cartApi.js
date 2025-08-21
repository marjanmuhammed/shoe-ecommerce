

import api from "../Api/axiosSetup";

const API_URL = "/Cart";

// GET user's cart
export const getUserCart = () => api.get(`${API_URL}/user`);

// POST add to cart
export const addToCart = (dto) => api.post(`${API_URL}`, dto);

// PUT update cart item quantity
export const updateCartItem = (cartItemId, quantity) =>
  api.put(`${API_URL}/${cartItemId}`, { quantity });

// DELETE remove cart item
export const removeCartItem = (cartItemId) => api.delete(`${API_URL}/${cartItemId}`);
