import api from "../Api/axiosSetup";

export const fetchAddresses = () => api.get("/address");
export const addAddress = (address) => api.post("/address", address);
export const updateAddress = (id, address) => api.put(`/address/${id}`, address);
export const deleteAddress = (id) => api.delete(`/address/${id}`);
// No changes needed here as the backend now handles filtering