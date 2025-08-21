// src/context/WishlistContext.js
import React, { createContext, useState, useEffect } from "react";
import { getWishlist, addToWishlist, removeFromWishlist } from "../Api/wishlistApi";

export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const data = await getWishlist();
    setWishlist(data);
  };

  const handleAdd = async (productId) => {
    const res = await addToWishlist(productId);
    if (res) {
      setWishlist((prev) => [...prev, res]); // update instantly
    }
  };

  const handleRemove = async (wishlistItemId) => {
    const res = await removeFromWishlist(wishlistItemId);
    if (res !== null) {
      setWishlist((prev) => prev.filter((item) => item.id !== wishlistItemId));
    }
  };

  const isInWishlist = (productId) =>
    wishlist.some((item) => item.productId === productId);

  return (
    <WishlistContext.Provider
      value={{ wishlist, handleAdd, handleRemove, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
