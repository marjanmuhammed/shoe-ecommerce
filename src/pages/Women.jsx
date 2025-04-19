import React, { useState } from 'react';
import Navbar from '../Navbarcontext/Navbar';
import Footer from '../footercomponent/Footer';
import { useContext } from 'react';
import { ProductContext } from '../ProductContext/ProductContext';

const Women = () => {
  const { womenShoes } = useContext(ProductContext); // Use Context API
  const [filteredShoes, setFilteredShoes] = useState(womenShoes);
  const [priceFilter, setPriceFilter] = useState("all");



  const handleFilterChange = (e) => {
    const selectedPrice = e.target.value;
    setPriceFilter(selectedPrice);
    
    if (selectedPrice === 'all') {
      setFilteredShoes(womenShoes);
    } else if (selectedPrice === 'low') {
      setFilteredShoes(womenShoes.filter(shoe => shoe.price < 50));
    } else if (selectedPrice === 'mid') {
      setFilteredShoes(womenShoes.filter(shoe => shoe.price >= 50 && shoe.price <= 100));
    } else if (selectedPrice === 'high') {
      setFilteredShoes(womenShoes.filter(shoe => shoe.price > 100));
    }
  };


  const addToCart = (shoe) => {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (cartItems.some((item) => item.id === shoe.id)) {
      alert(`${shoe.name} is already in the cart!`);
      return;
    }

    const updatedCart = [...cartItems, { ...shoe, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`${shoe.name} added to cart!`);
   
  };
  // Render the page content
  return (
    <>
      <Navbar />
      <div className="flex justify-between mt-4">
        {/* Left Side Content (Text and Image) */}
        <div className="w-1/3 flex flex-col justify-center pl-8">
        <div className="w-1/3 flex flex-col justify-center pl-8">
        <h2 className="text-6xl md:text-7xl font-extrabold text-pink-700 mb-6 shadow-lg uppercase tracking-widest whitespace-nowrap font-serif">
  Explore Our Women's Collection
</h2>



  <p className="text-lg text-gray-800 font-semibold mb-6 leading-normal">
    Explore the <span className="text-pink-500 font-bold">latest trends</span> 
  </p>
</div>

          <img
            src="https://vanillamoon.in/cdn/shop/files/Olga_-_Green_3__resized_4c69c55c-a661-473a-92f9-5f6e023afa87_grande.jpg?v=1739775904"
            alt="Footwear"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Video on the Right Side */}
        <div className="w-90 h-160 overflow-hidden border-3 border-gray-300 shadow-xl rounded-lg relative" style={{ left: '-100px' }}>
  <video className="object-cover w-full h-full" controls autoPlay>
    <source
      src="https://cdn.shopify.com/videos/c/o/v/a9d4fcbfcd164872a112bea0e3676ac6.mp4"
      type="video/mp4"
    />
    Your browser does not support the video tag.
  </video>
</div>
      </div>

      <div className="p-10 md:p-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 text-gray-900">
          Explore Our Women's Collection
        </h2>
        <p className="text-center text-gray-700 mb-12 text-lg md:text-xl">
          Discover premium sneakers, sports shoes, and casual footwear designed for every occasion.
        </p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 md:gap-14">
          {filteredShoes.map((shoe, index) => (
            <div
              key={index}
              className="p-12 md:p-16 rounded-lg bg-white shadow-2xl 
                hover:shadow-[0_0_40px_#3b82f6] transition duration-300 
                transform hover:scale-110"
            >
             <img
  src={shoe.image || shoe.image_url || "https://via.placeholder.com/200"}
  alt={shoe.name}
  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain mx-auto rounded-lg"
  onError={(e) => {
    if (e.target.src !== "https://via.placeholder.com/200") {
      e.target.src = "https://via.placeholder.com/200";
    }
  }}
/>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mt-4 sm:mt-6 text-gray-900 text-center">
                {shoe.name}
              </h3>
              <p className="text-gray-700 text-sm sm:text-lg md:text-xl mt-2 sm:mt-4 text-center">
                {shoe.description}
              </p>
              <p className="text-lg sm:text-2xl md:text-3xl font-extrabold text-blue-700 mt-2 sm:mt-4">
                ${shoe.price}
              </p>
              <button
                onClick={() => addToCart(shoe)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 mt-4 sm:mt-6 rounded-lg transition-all duration-300"
              >
                🛍️ Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Women;
