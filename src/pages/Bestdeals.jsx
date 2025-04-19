import {  useState,useContext } from "react";
import Navbar from "../Navbarcontext/Navbar";
import Footer from "../footercomponent/Footer";
import { ProductContext } from "../ProductContext/ProductContext";

const BestDeals = () => {
  const { dealsShoes } = useContext(ProductContext); // Use Context API
  const [filteredShoes, setFilteredShoes] = useState(dealsShoes);
  const [priceFilter, setPriceFilter] = useState("all");

  if (!dealsShoes) return <p>Loading deals...</p>;



  const handleFilterChange = (e) => {
    const selectedPrice = e.target.value;
    setPriceFilter(selectedPrice);
    
    if (selectedPrice === 'all') {
      setFilteredShoes(dealsShoes);
    } else if (selectedPrice === 'low') {
      setFilteredShoes(dealsShoes.filter(shoe => shoe.price < 50));
    } else if (selectedPrice === 'mid') {
      setFilteredShoes(dealsShoes.filter(shoe => shoe.price >= 50 && shoe.price <= 100));
    } else if (selectedPrice === 'high') {
      setFilteredShoes(dealsShoes.filter(shoe => shoe.price > 100));
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
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* Top Section with Videos & Images */}
      <div className="relative w-full p-8 bg-black text-white">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
        Explore Our Latest Deals! 
       
        </h1>
      
        
        {/* Video Section with Different Layouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="w-full rounded-lg shadow-lg p-2">
            <video autoPlay loop muted className="w-full rounded-lg shadow-lg">
              <source src="https://scontent.cdninstagram.com/o1/v/t16/f2/m86/AQOKTH8e9SHjOTAhx5VpeudT7aLpbZc6khXUqQzIvVmUEXMBPwgV5ARwlrbHxf0JfMAO4fGxSuZpX_G4zRMFWPMMMMq_O3yCBDEyVgg.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6InZ0c192b2RfdXJsZ2VuLmNsaXBzLnVua25vd24tQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSJ9&_nc_ht=scontent.cdninstagram.com&_nc_cat=108&_nc_oc=Adh6h3VAowzMwoe1ozdyZZOpeqHSnHGSYJFOrnQqfHQ7aeL90TpWl3jG8-qro3EInNQ&vs=1569218853739473_3923763247&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC8xMTRFQkNFMDBDNTBENzZDODM3RjZFMUEzRTczRjdCRF92aWRlb19kYXNoaW5pdC5tcDQVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dOMGMyaHhwSi00cEhjOEJBUGhsU2piTWttdDFicV9FQUFBRhUCAsgBACgAGAAbAYgHdXNlX29pbAExFQAAJuDWgZ%2BjnsVAFQIoAkMzLBdANfkWhysCDBgSZGFzaF9iYXNlbGluZV8xX3YxEQB1AAA%3D&ccb=9-4&oh=00_AYGUP4ZGuF6VFR5NepYnEOWMGf_DfMo5IFo6hXlIy2Xo2Q&oe=67D9AC38&_nc_sid=1d576d" type="video/mp4" />
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
{/* Image Gallery - Poster Shape Layout with Hover Effect */}
<div className="flex flex-wrap justify-center items-center gap-6 mb-10">
  
  {/* Image 1 */}
  <div className="w-52 h-72 p-3">
    <img src="https://i.pinimg.com/736x/26/38/2d/26382db98f7c113d76f8f7512727caf2.jpg" 
         alt="Shoes 1" 
         className="w-full h-full rounded-lg shadow-xl object-contain transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl" />
  </div>

  {/* Image 2 */}
  <div className="w-52 h-72 p-3">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLUkps4wEQg_F97nrW84n24tLu9OFTErB-Xw&s" 
         alt="Shoes 2" 
         className="w-full h-full rounded-lg shadow-xl object-contain transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl" />
  </div>

  {/* Image 3 */}
  <div className="w-52 h-72 p-3">
    <img src="https://i.pinimg.com/736x/c0/2c/87/c02c87418d8df36bca198a141d1eedf1.jpg" 
         alt="Shoes 3" 
         className="w-full h-full rounded-lg shadow-xl object-contain transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl" />
  </div>

  {/* Image 4 */}
  <div className="w-52 h-72 p-3">
    <img src="https://m.media-amazon.com/images/I/51e+wgNDDeL._AC_UY1000_.jpg" 
         alt="Shoes 4" 
         className="w-full h-full rounded-lg shadow-xl object-contain transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl" />
  </div>

</div>

      </div>


      

      {/* Best Deals Section */}
      <div className="p-10 md:p-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 text-gray-900">
           Best Deals & Discounts ⭐ 
        </h2>
        <p className="text-center text-gray-700 mb-12 text-lg md:text-xl">
          Grab the hottest deals on premium shoes at unbeatable prices!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center mb-8 sm:mb-12">
          <label className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-0 sm:mr-6">
            Filter by Price:
          </label>
          <select
            value={priceFilter}
            onChange={handleFilterChange}
            className="border-2 border-blue-500 bg-white text-lg sm:text-xl px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 hover:bg-blue-100"
          >
            <option value="all">All</option>
            <option value="low">Below $50</option>
            <option value="mid">$50 - $100</option>
            <option value="high">Above $100</option>
          </select>
        </div>
        


  



      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 md:gap-14">
  {filteredShoes.map((shoe, index) => {
    // Ensure price is a valid number
    const actualPrice = parseFloat(shoe.price) || 0;
    const discountPercentage = parseFloat(shoe.discount) || 0;
    const discountedPrice = (actualPrice - (actualPrice * discountPercentage) / 100).toFixed(2);

    return (
      <div
        key={index}
        className="relative p-12 md:p-16 rounded-lg bg-gradient-to-b from-gray-100 to-white 
        text-gray-900 shadow-2xl hover:shadow-[0_0_40px_#3b82f6] transition duration-300 
        transform hover:scale-110 flex flex-col items-center border border-gray-300"

      >
        {/* 🔥 Discount Badge (Top-Left) */}
        {discountPercentage > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs sm:text-sm font-bold 
                           px-3 py-1 rounded-full shadow-md animate-pulse">
            {discountPercentage}% OFF
          </span>
        )}

        {/* 🏷️ Product Image */}
        <img
          src={shoe.image_url || "https://via.placeholder.com/200"}
          alt={shoe.name}
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain mx-auto rounded-lg bg-white p-2"
          onError={(e) => e.target.src = "https://via.placeholder.com/200"}
        />

        {/* 📝 Product Name */}
        <h3 className="text-xl sm:text-2xl font-bold mt-4 text-center text-gray-800">
          {shoe.name}
        </h3>

        {/* 📝 Product Description */}
        <p className="text-sm sm:text-lg mt-2 text-center text-gray-600">
          {shoe.description}
        </p>

        {/* 💰 Price Section (Shows Actual Price & Discounted Price with a Line) */}
        <p className="text-lg sm:text-2xl font-extrabold mt-2">
          {discountPercentage > 0 ? (
            <>
              <span className="line-through text-gray-500 mr-2">${actualPrice.toFixed(2)}</span>
              <span className="text-green-600 font-bold">${discountedPrice}</span>
            </>
          ) : (
            <span className="text-gray-900 font-bold">${actualPrice.toFixed(2)}</span>
          )}
        </p>

        {/* 🛒 Add to Cart Button - Beautiful & Animated */}
        <button
          onClick={() => addToCart(shoe)}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 
                     text-white font-bold py-2 sm:py-3 px-4 sm:px-6 mt-4 rounded-full shadow-lg 
                     transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
        >
          🛍️ Add to Cart
        </button>
      </div>
    );
  })}
</div>

     

      <Footer />
    </div>
  );
};

export default BestDeals;












