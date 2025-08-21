import React, { useState, useContext, useEffect } from "react";
import Navbar from "../Navbarcontext/Navbar";
import Footer from "../footercomponent/Footer";
import { ProductContext } from "../ProductContext/ProductContext";
import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { toast, ToastContainer } from "react-toastify";
import api from "../Api/axiosSetup";
import { getWishlist, addToWishlist, removeFromWishlist } from "../Api/wishlistApi";

const Men = () => {
  const { menShoes } = useContext(ProductContext);
  const [filteredShoes, setFilteredShoes] = useState([]);
  const [priceFilter, setPriceFilter] = useState("all");
  const [favourites, setFavourites] = useState([]); // { productId, wishlistItemId }

  // Set filtered shoes
  useEffect(() => {
    setFilteredShoes(menShoes);
  }, [menShoes]);

  // Load wishlist safely
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

  const handleFilterChange = (e) => {
    const selectedPrice = e.target.value;
    setPriceFilter(selectedPrice);

    let filtered = [...menShoes];
    if (selectedPrice === "low") filtered = filtered.filter((shoe) => shoe.price < 50);
    else if (selectedPrice === "mid") filtered = filtered.filter((shoe) => shoe.price >= 50 && shoe.price <= 100);
    else if (selectedPrice === "high") filtered = filtered.filter((shoe) => shoe.price > 100);

    setFilteredShoes(filtered);
  };

  const addToCart = async (shoe) => {
    const isLogged = localStorage.getItem("isLoggedIn") === "true";
    const email = localStorage.getItem("userEmail");
    if (!isLogged) {
      toast.error("Please login to add products to your cart!", { position: "top-center", autoClose: 3000 });
      return;
    }

    try {
      await api.post("/Cart", { productId: shoe.id, quantity: 1 });
      toast.success(`${shoe.name ?? shoe.productName} added to your cart!`, { position: "top-center", autoClose: 3000 });

      const userCartKey = `cart_${email}`;
      let cart = JSON.parse(localStorage.getItem(userCartKey) || "[]");
      const existingIndex = cart.findIndex((item) => item.id === shoe.id);

      if (existingIndex >= 0) cart[existingIndex].quantity += 1;
      else cart.push({ ...shoe, quantity: 1 });

      localStorage.setItem(userCartKey, JSON.stringify(cart));
    } catch (error) {
      console.error(error);
      toast.error("Error adding product to cart", { position: "top-center", autoClose: 3000 });
    }
  };

  const handleFavouriteClick = async (shoe) => {
    const isLogged = localStorage.getItem("isLoggedIn") === "true";
    if (!isLogged) {
      toast.error("Please login to update wishlist!", { position: "top-center", autoClose: 2000 });
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
      <div className="relative w-full h-[200px]">
        <img
          src="https://bt-happy-feet.myshopify.com/cdn/shop/files/Rectangle_45194_1.png?crop=center&height=300&v=1703493419&width=1920"
          alt="Men's Collection"
          className="w-full h-full object-cover brightness-95"
        />
      </div>

      <div className="p-10 md:p-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 text-gray-900">
          Explore Our Men's Collection
        </h2>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pb-12">
          {filteredShoes.map((shoe) => {
            const isFav = favourites.some((f) => f.productId === shoe.id);
            const name = shoe.name ?? shoe.productName ?? "Product Name";
            const image = shoe.imageUrl ?? shoe.productImageUrl ?? "https://via.placeholder.com/150";
            const description = shoe.description ?? shoe.productDescription ?? "No description available";
            const price = shoe.price ?? shoe.productPrice ?? 999;

            return (
              <motion.div
                key={shoe.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative bg-white rounded-md border border-gray-200 overflow-hidden group shadow-sm p-3"
              >
                <div className="absolute top-2 left-2 z-10">
                  <span
                    className={`px-2 py-1 text-xs font-bold text-white rounded-sm ${
                      shoe.isBestSeller ? "bg-blue-600" : "bg-green-600"
                    }`}
                  >
                    {shoe.isBestSeller ? "BEST SELLER" : "NEW"}
                  </span>
                </div>

                <FaHeart
                  size={18}
                  className={`absolute top-2 right-2 cursor-pointer z-10 transition-colors duration-300 ${
                    isFav ? "text-red-500" : "text-gray-400 hover:text-red-500"
                  }`}
                  onClick={() => handleFavouriteClick(shoe)}
                />

                <div className="w-full h-40 flex justify-center items-center bg-gray-100">
                  <LazyLoadImage
                    src={image}
                    alt={name}
                    effect="blur"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => (e.target.src = "https://placehold.co/150")}
                  />
                </div>

                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center text-sm text-gray-700 gap-1">
                    <FaStar className="text-yellow-500" size={12} />
                    <span className="font-medium">{shoe.rating || "4.0"}</span>
                    <span className="text-gray-500">({shoe.reviewCount || "1"})</span>
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 leading-tight">{name}</h3>
                  <p className="text-xs text-gray-600">{description}</p>

                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm font-bold text-gray-900">Rs. {price}</span>
                    <span className="text-xs text-gray-500 line-through">Rs. {(price + 500)}</span>
                    <span className="text-green-600 text-xs font-semibold">{shoe.discount || "20% OFF"}</span>
                  </div>

                  <button
                    onClick={() => addToCart(shoe)}
                    className="w-full border border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white font-medium py-1 mt-1 rounded-sm flex justify-center items-center gap-1 text-xs transition-all duration-300"
                  >
                    <FaShoppingCart size={14} /> ADD TO CART
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Footer />
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default Men;
