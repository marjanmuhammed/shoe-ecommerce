import React, { useState, useEffect, useContext, useMemo } from 'react';
import Navbar from '../Navbarcontext/Navbar';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../ProductContext/ProductContext';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaHeart } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { motion } from "framer-motion";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const navigate = useNavigate();
  const { homeShoes } = useContext(ProductContext);
  const [filteredShoes, setFilteredShoes] = useState([]);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    setFilteredShoes(homeShoes);
  }, [homeShoes]);

  useEffect(() => {
    // Load the saved wishlist from localStorage when the component mounts
    const savedFavourites = JSON.parse(localStorage.getItem('favourites')) || [];
    setFavourites(savedFavourites);
  }, []);

  useEffect(() => {
    // Persist the favourites list to localStorage whenever it changes
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }, [favourites]);

  const addToCart = (shoe) => {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (cartItems.some((item) => item.id === shoe.id)) {
      toast.warning(`${shoe.name} is already in the cart!`, {
        position: "top-center",
        transition: Slide,
      });
      return;
    }

    const updatedCart = [...cartItems, { ...shoe, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success(`${shoe.name} added to cart!`, {
      position: "top-center",
      transition: Slide,
    });
  };

  const handleFavouriteClick = (shoe) => {
    setFavourites((prevFavourites) => {
      if (prevFavourites.includes(shoe.id)) {
        // Remove shoe from favourites
        const updatedFavourites = prevFavourites.filter((id) => id !== shoe.id);
        // Update localStorage with the new favourites list
        localStorage.setItem('favourites', JSON.stringify(updatedFavourites));
        return updatedFavourites;
      } else {
        // Add shoe to favourites
        const updatedFavourites = [...prevFavourites, shoe.id];
        // Update localStorage with the new favourites list
        localStorage.setItem('favourites', JSON.stringify(updatedFavourites));
        return updatedFavourites;
      }
    });
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

      {/* Product List with animation & lazy load */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 md:gap-14 px-6 pb-12">
        {memoizedShoes.map((shoe, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
            className="relative p-12 md:p-16 rounded-lg bg-white shadow-2xl hover:shadow-[0_0_40px_#3b82f6] transition duration-300 transform hover:scale-110"
          >
            {/* Favourite Icon */}
            <FaHeart
              size={24}
              className={`absolute top-4 right-4 cursor-pointer transition-colors duration-300 ${favourites.includes(shoe.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              onClick={() => handleFavouriteClick(shoe)}
            />

            <LazyLoadImage
              src={shoe.image_url || "https://via.placeholder.com/200"}
              alt={shoe.name}
              effect="blur"
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain mx-auto rounded-lg"
              onError={(e) => e.target.src = "https://placehold.co/200"}
            />
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mt-4 sm:mt-6 text-gray-900 text-center">
              {shoe.name}
            </h3>
            <p className="text-gray-700 text-sm sm:text-lg md:text-xl mt-2 sm:mt-4 text-center">
              {shoe.description}
            </p>
            <p className="text-lg sm:text-2xl md:text-3xl font-extrabold text-blue-700 mt-2 sm:mt-4 text-center">
              ${shoe.price}
            </p>
            <button
              onClick={() => addToCart(shoe)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 mt-4 sm:mt-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              🛍️  Add to Cart
            </button>
          </motion.div>
        ))}
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center space-x-6 mb-6">
            <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={30} className="text-blue-400 hover:text-white transition" />
            </a>
            <a href="https://www.twitter.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={30} className="text-blue-300 hover:text-white transition" />
            </a>
            <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={30} className="text-pink-400 hover:text-white transition" />
            </a>
            <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={30} className="text-blue-500 hover:text-white transition" />
            </a>
            <a href="https://www.youtube.com/yourchannel" target="_blank" rel="noopener noreferrer">
              <FaYoutube size={30} className="text-red-500 hover:text-white transition" />
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-400">Shoes Store &copy; 2025 - Your favorite place to buy shoes at unbeatable prices!</p>
        </div>
      </footer>
    </>
  );
};

export default Home;
