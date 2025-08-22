import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbarcontext/Navbar";
import Footer from "../footercomponent/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { getWishlist, removeFromWishlist } from "../Api/wishlistApi";
import { addToCart } from "../Api/cartApi";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const toastConfig = { position: "top-center", autoClose: 2000 };
  const navigate = useNavigate();

  const isLogged = () => localStorage.getItem("isLoggedIn") === "true";

  const fetchWishlistData = async () => {
    try {
      const data = await getWishlist();
      setWishlist(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load favourites", toastConfig);
    }
  };

  useEffect(() => {
    fetchWishlistData();
  }, []);

  const handleRemoveFavourite = async (wishlistItemId) => {
    const res = await removeFromWishlist(wishlistItemId);
    if (res !== null) {
      setWishlist((prev) => prev.filter((item) => item.id !== wishlistItemId));
      toast.info("Removed from favourites", toastConfig);
    } else {
      toast.error("Failed to remove item", toastConfig);
    }
  };

  const goToCheckout = async (item) => {
    if (!isLogged()) {
      toast.error("Please login to checkout!", toastConfig);
      return;
    }

    if (!item || !item.productId) {
      toast.error("Invalid product selected", toastConfig);
      return;
    }

    try {
      // ❗ Add product to cart with wishlistId
      await addToCart(item.productId, 1, item.id); // Pass wishlistId as 3rd param

      toast.success("Product added to cart. Redirecting...", toastConfig);

      // Navigate to payment page
      navigate("/pay");
    } catch (err) {
      console.error(err);
      toast.error("The product already in the cart go to check out", toastConfig);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Your Favourites
        </h2>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-transform"
              >
                <FaHeart
                  size={20}
                  className="absolute top-2 right-2 text-red-500 cursor-pointer"
                  onClick={() => handleRemoveFavourite(item.id)}
                />

                <div className="w-full h-40 flex justify-center items-center bg-gray-100">
                  <img
                    src={item.productImageUrl || "https://placehold.co/150"}
                    alt={item.productName || "Product"}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <h3 className="text-lg font-bold mt-3 text-gray-900 text-center">
                  {item.productName || "Product Name"}
                </h3>
                <p className="text-gray-700 text-sm mt-1 text-center">
                  {item.productDescription || "No description available"}
                </p>
                <p className="text-blue-700 font-bold text-center mt-1">
                  Rs. {item.productPrice || 999}
                </p>

                <button
                  type="button"
                  onClick={() => goToCheckout(item)}
                  className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-1 rounded flex justify-center items-center gap-2 transition-all duration-300"
                >
                  Check Out
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700 text-lg mt-6">
            No items in your favourites
          </p>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default WishlistPage;
