import React, { useState } from 'react';
import Navbar from '../Navbarcontext/Navbar';
import { useContext } from 'react';
import Footer from '../footercomponent/Footer';
import { ProductContext } from '../ProductContext/ProductContext';



const Men = () => {
  const { menShoes } = useContext(ProductContext); // Use Context API
  const [filteredShoes, setFilteredShoes] = useState(menShoes);
  const [priceFilter, setPriceFilter] = useState("all");


  const handleFilterChange = (e) => {
    const selectedPrice = e.target.value;
    setPriceFilter(selectedPrice);
    
    if (selectedPrice === 'all') {
      setFilteredShoes(menShoes);
    } else if (selectedPrice === 'low') {
      setFilteredShoes(menShoes.filter(shoe => shoe.price < 50));
    } else if (selectedPrice === 'mid') {
      setFilteredShoes(menShoes.filter(shoe => shoe.price >= 50 && shoe.price <= 100));
    } else if (selectedPrice === 'high') {
      setFilteredShoes(menShoes.filter(shoe => shoe.price > 100));
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 md:gap-14">
          {filteredShoes.map((shoe, index) => (
            <div
              key={index}
              className="p-12 md:p-16 rounded-lg bg-white shadow-2xl 
              hover:shadow-[0_0_40px_#3b82f6] transition duration-300 
              transform hover:scale-110"
            >
        <img 
  src={shoe.image_url || shoe.image} 
  alt={shoe.name} 
  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain mx-auto rounded-lg"
  onError={(e) => e.target.src = "https://via.placeholder.com/200"} // 🔥 Placeholder image if error
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

export default Men;