import api from "../Api/axiosSetup";

export const fetchAddresses = () => api.get("/Address");
export const addAddress = (address) => api.post("/Address", address);
export const updateAddress = (id, address) => api.put(`/Address/${id}`, address);
export const deleteAddress = (id) => api.delete(`/Address/${id}`);
