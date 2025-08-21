import api from "../Api/axiosSetup";

// fetch wishlist
export const getWishlist = async () => {
  try {
    const res = await api.get("/wishlist");
    return res.data || []; // safe fallback
  } catch (err) {
    console.error("Failed to fetch wishlist", err.response?.data || err.message);
    return [];
  }
};

// add item
export const addToWishlist = async (productId) => {
  try {
    const res = await api.post("/wishlist", { productId });
    return res.data;
  } catch (err) {
    console.error("Failed to add to wishlist", err.response?.data || err.message);
    return null;
  }
};

// remove item by wishlistItemId
export const removeFromWishlist = async (wishlistItemId) => {
  try {
    const res = await api.delete(`/wishlist/${wishlistItemId}`);
    return res.data;
  } catch (err) {
    console.error("Failed to remove from wishlist", err.response?.data || err.message);
    return null;
  }
};
