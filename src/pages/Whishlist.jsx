import React, { useContext, useState } from 'react';
import { ProductContext } from '../ProductContext/ProductContext';
import { motion } from 'framer-motion';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // For navigation
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Navbarcontext/Navbar';

const Wishlist = () => {
  const { homeShoes } = useContext(ProductContext);
  const [favourites, setFavourites] = useState(JSON.parse(localStorage.getItem("favourites")) || []);
  const navigate = useNavigate();

  const handleRemoveFromFavourite = (shoeId) => {
    const updatedFavourites = favourites.filter(id => id !== shoeId);
    setFavourites(updatedFavourites);
    localStorage.setItem('favourites', JSON.stringify(updatedFavourites));
  };

  const handleAddToCart = (shoe) => {
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

  const wishlistShoes = homeShoes.filter(shoe => favourites.includes(shoe.id));

  const navigateToHome = () => {
    navigate("/"); // Navigate to Home page
  };

  return (
    <>
      <Navbar />
      <ToastContainer autoClose={1500} />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Your Wishlist</h2>
        {wishlistShoes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {wishlistShoes.map((shoe, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: "easeInOut",
                }}
                className="relative p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
              >
                <img
                  src={shoe.image_url || "https://via.placeholder.com/200"}
                  alt={shoe.name}
                  className="w-40 h-40 object-contain mx-auto rounded-lg"
                />
                <h3 className="text-xl sm:text-2xl font-bold mt-4 text-gray-900 text-center">{shoe.name}</h3>
                <p className="text-gray-700 text-sm mt-2 text-center">{shoe.description}</p>
                <p className="text-xl sm:text-2xl font-extrabold text-blue-700 mt-2 text-center">${shoe.price}</p>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleAddToCart(shoe)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none"
                  >
                    🛒 Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromFavourite(shoe.id)}
                    className="ml-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none"
                  >
                 
                    <span className="ml-2">Remove </span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-700">No items in your wishlist</p>
        )}

       
      </div>
    </>
  );
};

export default Wishlist;
