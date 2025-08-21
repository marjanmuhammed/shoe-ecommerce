// BestDeals.js
import React, { useState, useEffect } from "react";
import Navbar from "../Navbarcontext/Navbar";
import Footer from "../footercomponent/Footer";
import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { toast, ToastContainer } from "react-toastify";
import api from "../Api/axiosSetup"; // interceptor axios instance
import "react-toastify/dist/ReactToastify.css";
import { getWishlist, addToWishlist, removeFromWishlist } from "../Api/wishlistApi";

const BestDeals = () => {
  const [dealsShoes, setDealsShoes] = useState([]);
  const [filteredShoes, setFilteredShoes] = useState([]);
  const [priceFilter, setPriceFilter] = useState("all");
  const [favourites, setFavourites] = useState([]); // ✅ store objects same as Women.js

  // 🔹 Fetch Best Deals products
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await api.get("/Products/category/Best Deals");
        setDealsShoes(res.data);
        setFilteredShoes(res.data);
      } catch (err) {
        console.error("Error fetching Best Deals:", err);
        toast.error("Failed to load Best Deals products", { position: "top-center" });
      }
    };
    fetchDeals();
  }, []);

  // ✅ Load wishlist (same as Women.js)
  useEffect(() => {
    const fetchWishlist = async () => {
      const isLogged = localStorage.getItem("isLoggedIn") === "true";
      if (!isLogged) return;
      try {
        const data = await getWishlist();
        setFavourites(
          data.map((item) => ({
            productId: item.productId ?? 0,
            wishlistItemId: item.id ?? 0,
            productName: item.productName ?? "Unknown Product",
            productImageUrl: item.productImageUrl ?? "",
            productPrice: item.productPrice ?? 0,
            productDescription: item.productDescription ?? "",
            productCategory: item.productCategory ?? "Uncategorized",
          }))
        );
      } catch (err) {
        console.error("Failed to load wishlist", err.response?.data || err.message);
      }
    };
    fetchWishlist();
  }, []);

  // 🔹 Filter handler
  const handleFilterChange = (e) => {
    const selectedPrice = e.target.value;
    setPriceFilter(selectedPrice);

    let filtered = [...dealsShoes];
    if (selectedPrice === "low") filtered = filtered.filter((shoe) => shoe.price < 50);
    else if (selectedPrice === "mid") filtered = filtered.filter((shoe) => shoe.price >= 50 && shoe.price <= 100);
    else if (selectedPrice === "high") filtered = filtered.filter((shoe) => shoe.price > 100);

    setFilteredShoes(selectedPrice === "all" ? dealsShoes : filtered);
  };

  // 🔹 Add to Cart
  const addToCart = async (shoe) => {
    const isLogged = localStorage.getItem("isLoggedIn") === "true";
    const email = localStorage.getItem("userEmail");

    if (!isLogged) {
      toast.error("Please login to add products to your cart!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      await api.post("/Cart", { productId: shoe.id, quantity: 1 });

      toast.success(`${shoe.name} added to your cart!`, {
        position: "top-center",
        autoClose: 3000,
      });

      const userCartKey = `cart_${email}`;
      let cart = JSON.parse(localStorage.getItem(userCartKey) || "[]");
      const existingIndex = cart.findIndex((item) => item.id === shoe.id);

      if (existingIndex >= 0) cart[existingIndex].quantity += 1;
      else cart.push({ ...shoe, quantity: 1 });

      localStorage.setItem(userCartKey, JSON.stringify(cart));
    } catch (error) {
      console.error(error);
      toast.error("Error adding product to cart", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  // ✅ Wishlist toggle (same as Women.js)
  const handleFavouriteClick = async (shoe) => {
    const isLogged = localStorage.getItem("isLoggedIn") === "true";
    if (!isLogged) {
      toast.error("Please login to update wishlist!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      const existing = favourites.find((f) => f.productId === shoe.id);

      if (existing) {
        await removeFromWishlist(existing.wishlistItemId);
        setFavourites((prev) => prev.filter((f) => f.productId !== shoe.id));
        toast.info("Removed from favourites", { position: "top-center", autoClose: 2000 });
      } else {
        const res = await addToWishlist(shoe.id);
        if (res) {
          setFavourites((prev) => [
            ...prev,
            {
              productId: res.productId ?? 0,
              wishlistItemId: res.id ?? 0,
              productName: res.productName ?? "Unknown Product",
              productImageUrl: res.productImageUrl ?? "",
              productPrice: res.productPrice ?? 0,
              productDescription: res.productDescription ?? "",
              productCategory: res.productCategory ?? "Uncategorized",
            },
          ]);
          toast.success("Added to favourites", { position: "top-center", autoClose: 2000 });
        }
      }
    } catch (err) {
      console.error("Wishlist error", err.response?.data || err.message);
      toast.error("Error updating wishlist", { position: "top-center", autoClose: 3000 });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* 🔹 Top Section with Videos + Gallery (kept same) */}
      <div className="relative w-full p-8 bg-black text-white">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Explore Our Latest Deals!
        </h1>

        {/* Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="w-full rounded-lg shadow-lg p-2">
            <video autoPlay loop muted className="w-full rounded-lg shadow-lg">
              <source src="https://player.vimeo.com/external/395295882.sd.mp4?s=6a911c82d6e6" type="video/mp4" />
            </video>
          </div>
          <div className="w-full rounded-lg shadow-lg p-2 flex justify-center">
            <video autoPlay loop muted className="w-3/4 rounded-lg shadow-lg">
              <source src="https://cdn.shopify.com/videos/c/o/v/f5ea062baca14a30b6d3a4246ca404b7.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="w-full p-3 flex justify-end">
            <video autoPlay loop muted className="w-4/6 rounded-3xl shadow-2xl">
              <source src="https://videos.pexels.com/video-files/4380323/4380323-sd_360_640_30fps.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Gallery */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-10">
          {[
            "https://i.pinimg.com/736x/26/38/2d/26382db98f7c113d76f8f7512727caf2.jpg",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLUkps4wEQg_F97nrW84n24tLu9OFTErB-Xw&s",
            "https://i.pinimg.com/736x/c0/2c/87/c02c87418d8df36bca198a141d1eedf1.jpg",
            "https://m.media-amazon.com/images/I/51e+wgNDDeL._AC_UY1000_.jpg",
          ].map((img, idx) => (
            <div key={idx} className="w-52 h-72 p-3">
              <img
                src={img}
                alt={`Shoes ${idx + 1}`}
                className="w-full h-full rounded-lg shadow-xl object-contain transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Filter Section */}
      <div className="p-10 md:p-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
          Best Deals & Discounts ⭐
        </h2>
        <p className="text-gray-700 mb-6 text-lg md:text-xl">
          Grab the hottest deals on premium shoes at unbeatable prices!
        </p>

        <div className="flex justify-center items-center gap-4">
          <label className="text-lg md:text-xl font-semibold text-gray-900">
            Filter by Price:
          </label>
          <select
            value={priceFilter}
            onChange={handleFilterChange}
            className="border-2 border-blue-500 bg-white text-lg md:text-xl px-3 py-2 rounded-full shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 hover:bg-blue-100"
          >
            <option value="all">All</option>
            <option value="low">Below $50</option>
            <option value="mid">$50 - $100</option>
            <option value="high">Above $100</option>
          </select>
        </div>
      </div>

      {/* 🔹 Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pb-12">
        {filteredShoes.map((shoe) => {
          const isFav = favourites.some((f) => f.productId === shoe.id);
          return (
            <motion.div
              key={shoe.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-md border border-gray-200 overflow-hidden group shadow-sm p-3"
            >
              {/* Badge */}
              <div className="absolute top-2 left-2 z-10">
                <span
                  className={`px-2 py-1 text-xs font-bold text-white rounded-sm ${
                    shoe.isBestSeller ? "bg-blue-600" : "bg-green-600"
                  }`}
                >
                  {shoe.isBestSeller ? "BEST DEAL" : "NEW"}
                </span>
              </div>

              {/* ❤️ Favourite */}
              <FaHeart
                size={18}
                className={`absolute top-2 right-2 cursor-pointer z-10 transition-colors duration-300 ${
                  isFav ? "text-red-500" : "text-gray-400 hover:text-red-500"
                }`}
                onClick={() => handleFavouriteClick(shoe)}
                title={isFav ? "Remove from favourites" : "Add to favourites"}
              />

              {/* Image */}
              <div className="w-full h-40 flex justify-center items-center bg-gray-100">
                <LazyLoadImage
                  src={shoe.imageUrl || "https://via.placeholder.com/150"}
                  alt={shoe.name || "Product Image"}
                  effect="blur"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => (e.target.src = "https://placehold.co/150")}
                />
              </div>

              {/* Details */}
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center text-sm text-gray-700 gap-1">
                  <FaStar className="text-yellow-500" size={12} />
                  <span className="font-medium">{shoe.rating || "4.0"}</span>
                  <span className="text-gray-500">({shoe.reviewCount || "1"})</span>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                  {shoe.name || "Product Name"}
                </h3>

                <p className="text-xs text-gray-600">
                  {shoe.description || "No description available"}
                </p>

                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm font-bold text-gray-900">
                    Rs. {shoe.price || 999}
                  </span>
                  <span className="text-xs text-gray-500 line-through">
                    Rs. {shoe.oldPrice || (shoe.price ? shoe.price + 500 : 1499)}
                  </span>
                  <span className="text-green-600 text-xs font-semibold">
                    {shoe.discount || "20% OFF"}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(shoe)}
                  className="w-full border border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white font-medium py-1 mt-1 rounded-sm flex justify-center items-center gap-1 text-xs transition-all duration-300"
                >
                  <FaShoppingCart size={14} />
                  ADD TO CART
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Footer />
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default BestDeals;
