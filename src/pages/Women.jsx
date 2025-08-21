// Women.js
import React, { useState, useContext, useEffect } from "react";
import Navbar from "../Navbarcontext/Navbar";
import Footer from "../footercomponent/Footer";
import { ProductContext } from "../ProductContext/ProductContext";
import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../Api/axiosSetup"; // ✅ interceptor-based axios instance
import { getWishlist, addToWishlist, removeFromWishlist } from "../Api/wishlistApi";

const Women = () => {
  // Context (fallback)
  const { womenShoes } = useContext(ProductContext);

  // Local state (DB + filters + favs)
  const [womenList, setWomenList] = useState([]); // base list used for filtering
  const [filteredShoes, setFilteredShoes] = useState([]);
  const [priceFilter, setPriceFilter] = useState("all");
  const [favourites, setFavourites] = useState([]); // { productId, wishlistItemId }

  // Seed from Context first (so UI shows fast)
  useEffect(() => {
    if (Array.isArray(womenShoes) && womenShoes.length) {
      setWomenList(womenShoes);
      setFilteredShoes(womenShoes);
    }
  }, [womenShoes]);

  // Then fetch fresh from DB via interceptor (override gracefully)
  useEffect(() => {
    const fetchWomenFromApi = async () => {
      try {
        const res = await api.get("/Products/category/Women");
        if (Array.isArray(res.data)) {
          setWomenList(res.data);
          setFilteredShoes(res.data);
        }
      } catch (err) {
        console.error("Error fetching Women Shoes:", err);
        // no toast here to avoid noisy UX; UI still works with context data
      }
    };
    fetchWomenFromApi();
  }, []);

  // ✅ Load wishlist safely (same as Men.js)
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

  // Price filter
  const handleFilterChange = (e) => {
    const selectedPrice = e.target.value;
    setPriceFilter(selectedPrice);

    let filtered = [...womenList];
    if (selectedPrice === "low") filtered = filtered.filter((shoe) => Number(shoe.price) < 50);
    else if (selectedPrice === "mid")
      filtered = filtered.filter((shoe) => Number(shoe.price) >= 50 && Number(shoe.price) <= 100);
    else if (selectedPrice === "high") filtered = filtered.filter((shoe) => Number(shoe.price) > 100);

    setFilteredShoes(selectedPrice === "all" ? womenList : filtered);
  };

  // Add to cart (same pattern as Men.js)
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

      // Per-user local cache (like Men.js)
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

  // ✅ Favourite toggle (same as Men.js)
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
    <>
      <Navbar />

      {/* ✅ Your original hero with left text+image and right video preserved */}
      <div className="flex justify-between mt-4">
        {/* Left Side Content (Text and Image) */}
        <div className="w-1/3 flex flex-col justify-center pl-8">
          <h2 className="text-6xl md:text-7xl font-extrabold text-pink-700 mb-6 shadow-lg uppercase tracking-widest whitespace-nowrap font-serif">
            Explore Our Women's Collection
          </h2>
          <p className="text-lg text-gray-800 font-semibold mb-6 leading-normal">
            Explore the <span className="text-pink-500 font-bold">latest trends</span>
          </p>
          <img
            src="https://vanillamoon.in/cdn/shop/files/Olga_-_Green_3__resized_4c69c55c-a661-473a-92f9-5f6e023afa87_grande.jpg?v=1739775904"
            alt="Footwear"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Video on the Right Side */}
        <div
          className="w-90 h-160 overflow-hidden border-3 border-gray-300 shadow-xl rounded-lg relative"
          style={{ left: "-100px" }}
        >
          <video className="object-cover w-full h-full" controls autoPlay>
            <source
              src="https://cdn.shopify.com/videos/c/o/v/a9d4fcbfcd164872a112bea0e3676ac6.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Products */}
      <div className="p-10 md:p-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 text-gray-900">
          Explore Our Women's Collection
        </h2>
        <p className="text-center text-gray-700 mb-12 text-lg md:text-xl">
          Discover premium sneakers, sports shoes, and casual footwear designed for every occasion.
        </p>

        {/* Price Filter */}
        <div className="flex flex-col md:flex-row items-start md:items-center mb-12">
          <label className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 md:mb-0 md:mr-6">
            Filter by Price:
          </label>
          <select
            value={priceFilter}
            onChange={handleFilterChange}
            className="border-2 border-blue-500 bg-white text-lg md:text-xl px-3 py-2 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 hover:bg-blue-100"
          >
            <option value="all">All</option>
            <option value="low">Below $50</option>
            <option value="mid">$50 - $100</option>
            <option value="high">Above $100</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredShoes.map((shoe, index) => {
            const isFav = favourites.some((f) => f.productId === shoe.id);
            return (
              <motion.div
                key={shoe.id ?? index}
                className="relative p-4 rounded-lg bg-white shadow-lg hover:shadow-xl transition duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* ❤️ Favourite icon */}
                <FaHeart
                  size={18}
                  className={`absolute top-2 right-2 cursor-pointer z-10 transition-colors duration-300 ${
                    isFav ? "text-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                  onClick={() => handleFavouriteClick(shoe)}
                  title={isFav ? "Remove from favourites" : "Add to favourites"}
                />

                {/* Product Image */}
                <img
                  src={shoe.image || shoe.imageUrl || "https://via.placeholder.com/200"}
                  alt={shoe.name}
                  className="w-full h-40 object-contain rounded-lg mb-2"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/200";
                  }}
                />

                {/* Content */}
                <div className="flex flex-col gap-1 mt-2">
                  {/* Rating */}
                  <div className="flex items-center text-sm text-gray-700 gap-1">
                    <FaStar className="text-yellow-500" size={12} />
                    <span className="font-medium">{shoe.rating || "4.0"}</span>
                    <span className="text-gray-500">({shoe.reviewCount || "1"})</span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                    {shoe.name || "Product Name"}
                  </h3>

                  {/* Product Description */}
                  <p className="text-xs text-gray-600">
                    {shoe.description || "No description available"}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm font-bold text-gray-900">Rs. {shoe.price ?? 99}</span>
                    <span className="text-xs text-gray-500 line-through">
                      Rs. {shoe.oldPrice ?? (shoe.price ?? 99) + 50}
                    </span>
                    <span className="text-green-600 text-xs font-semibold">{shoe.discount || "20% OFF"}</span>
                  </div>

                  {/* Add to Cart Button */}
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
      </div>

      <Footer />
      {/* Toasts */}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default Women;
