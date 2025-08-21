import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../Navbarcontext/Navbar';
import { useNavigate } from 'react-router-dom';
import api from '../Api/axiosSetup';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaHeart ,FaStar,FaShoppingCart } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { motion } from "framer-motion";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addToWishlist, removeFromWishlist } from "../Api/wishlistApi";

const Home = () => {
  const navigate = useNavigate();
  const [filteredShoes, setFilteredShoes] = useState([]);
  const [favourites, setFavourites] = useState([]);

  // Fetch products
  useEffect(() => {
    api.get("/Products/category/Home")
      .then(res => setFilteredShoes(res.data))
      .catch(err => console.error("Error loading products:", err));
  }, []);

  // Load saved favourites per user
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const favKey = email ? `favourites_${email}` : 'favourites';
    const savedFavourites = JSON.parse(localStorage.getItem(favKey)) || [];
    setFavourites(savedFavourites);
  }, []);

  // Save favourites
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const favKey = email ? `favourites_${email}` : 'favourites';
    localStorage.setItem(favKey, JSON.stringify(favourites));
  }, [favourites]);

  // Add to Cart
  const addToCart = async (shoe) => {
    const isLogged = localStorage.getItem("isLoggedIn") === "true";
    const email = localStorage.getItem("userEmail");

    if (!isLogged) {
      toast.error("Please login to add products to your cart!", { position: "top-center", autoClose: 3000 });
      return;
    }

    try {
      await api.post("/Cart", { productId: shoe.id, quantity: 1 });
      toast.success(`${shoe.name} added to your cart!`, { position: "top-center", autoClose: 3000 });

      const userCartKey = `cart_${email}`;
      let cart = JSON.parse(localStorage.getItem(userCartKey) || "[]");
      const existingIndex = cart.findIndex(item => item.id === shoe.id);

      if (existingIndex >= 0) cart[existingIndex].quantity += 1;
      else cart.push({ ...shoe, quantity: 1 });

      localStorage.setItem(userCartKey, JSON.stringify(cart));
    } catch (error) {
      console.error(error);
      toast.error("Error adding product to cart", { position: "top-center", autoClose: 3000 });
    }
  };

  // Wishlist toggle
  const handleFavouriteClick = async (shoe) => {
    const isLogged = localStorage.getItem("isLoggedIn") === "true";
    if (!isLogged) {
      toast.error("Please login to update wishlist!", { position: "top-center", autoClose: 2000 });
      return;
    }

    const existing = favourites.find((f) => f.productId === shoe.id);

    if (existing) {
      // Optimistically update UI first
      setFavourites(prev => prev.filter(f => f.productId !== shoe.id));
      toast.info("Removed from favourites", { position: "top-center", autoClose: 2000 });

      try {
        await removeFromWishlist(existing.wishlistItemId);
      } catch (err) {
        console.error("Wishlist remove error", err);
        toast.error("Error removing from wishlist", { position: "top-center", autoClose: 3000 });
        // rollback if backend fails
        setFavourites(prev => [...prev, existing]);
      }
    } else {
      try {
        const res = await addToWishlist(shoe.id);
        if (res) {
          const newFav = {
            productId: res.productId ?? shoe.id,
            wishlistItemId: res.id,
            productName: res.productName ?? shoe.name,
            productImageUrl: res.productImageUrl ?? shoe.imageUrl,
            productPrice: res.productPrice ?? shoe.price,
            productDescription: res.productDescription ?? shoe.description,
            productCategory: res.productCategory ?? shoe.category,
          };
          setFavourites(prev => [...prev, newFav]);
          toast.success("Added to favourites", { position: "top-center", autoClose: 2000 });
        }
      } catch (err) {
        console.error("Wishlist add error", err);
        toast.error("Error adding to wishlist", { position: "top-center", autoClose: 3000 });
      }
    }
  };

  const memoizedShoes = useMemo(() => filteredShoes, [filteredShoes]);

  return (
    <>
      <Navbar />
      <ToastContainer autoClose={1500} />

      {/* Carousel */}
      <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {[
            "https://neemans.com/cdn/shop/files/Web_Banner_UC_-_Desktop_1920_x_800.jpg?v=1740038766&width=1500",
            "https://neemans.com/cdn/shop/files/Homepage_Banner_-_TUBR_-_Desktop_1920_x_800_px_a.jpg?v=1740566485&width=1500",
            "https://neemans.com/cdn/shop/files/ND_-_COB_-_Web_Banner_-_Desktop_1920_x_800_px.jpg?v=1739879182&width=1500"
          ].map((src, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`} data-bs-interval="3000">
              <img src={src} className="d-block w-100" alt="..." />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pb-12">
        {memoizedShoes.map((shoe, index) => (
          <motion.div
            key={shoe.id} // always use unique id
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="relative bg-white rounded-md border border-gray-200 overflow-hidden group shadow-sm p-3"
          >
            <div className="absolute top-2 left-2 z-10">
              <span className={`px-2 py-1 text-xs font-bold text-white rounded-sm ${shoe.isBestSeller ? 'bg-blue-600' : 'bg-green-600'}`}>
                {shoe.isBestSeller ? 'BEST SELLER' : 'NEW'}
              </span>
            </div>

            <FaHeart
              size={18}
              className={`absolute top-2 right-2 cursor-pointer z-10 transition-colors duration-300 
                ${favourites.some(f => f.productId === shoe.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              onClick={() => handleFavouriteClick(shoe)}
            />

            <div className="w-full h-40 flex justify-center items-center bg-gray-100">
              <LazyLoadImage
                src={shoe.imageUrl || "https://via.placeholder.com/150"}
                alt={shoe.name || "Product Image"}
                effect="blur"
                className="max-h-full max-w-full object-contain"
                onError={(e) => e.target.src = "https://placehold.co/150"}
              />
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center text-sm text-gray-700 gap-1">
                <FaStar className="text-yellow-500" size={12} />
                <span className="font-medium">{shoe.rating || "4.0"}</span>
                <span className="text-gray-500">({shoe.reviewCount || "1"})</span>
              </div>

              <h3 className="text-sm font-semibold text-gray-900 leading-tight">{shoe.name || "Product Name"}</h3>

              <p className="text-xs text-gray-600">{shoe.description || "No description available"}</p>

              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm font-bold text-gray-900">Rs. {shoe.price || 999}</span>
                <span className="text-xs text-gray-500 line-through">Rs. {shoe.oldPrice || ((shoe.price || 999) + 500)}</span>
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
        ))}
      </div>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#"><FaFacebook size={30} className="text-blue-400 hover:text-white transition" /></a>
            <a href="#"><FaTwitter size={30} className="text-blue-300 hover:text-white transition" /></a>   
            <a href="#"><FaInstagram size={30} className="text-pink-400 hover:text-white transition" /></a>
            <a href="#"><FaLinkedin size={30} className="text-blue-500 hover:text-white transition" /></a>
            <a href="#"><FaYoutube size={30} className="text-red-500 hover:text-white transition" /></a>
          </div>
          <p className="mt-6 text-sm text-gray-400">Shoes Store &copy; 2025</p>
        </div>
      </footer>
    </>
  );
};

export default Home;
