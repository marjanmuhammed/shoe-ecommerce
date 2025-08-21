import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaUserCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLogged, setIsLogged] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [cartCount, setCartCount] = useState(0);
  const [userName, setUserName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toast configuration
  const toastConfig = {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  // Load user data
  const loadUserData = () => {
    const email = localStorage.getItem("userEmail");
    const userCartKey = `cart_${email}`;
    const storedCart = JSON.parse(localStorage.getItem(userCartKey)) || [];
    const totalItems = storedCart.reduce((total, item) => total + (item.quantity || 1), 0);
    setCartCount(totalItems);

    if (localStorage.getItem("isLoggedIn") === "true") {
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      setUserName(loggedInUser?.fullName || "");
      setIsLogged(true);
    } else {
      setUserName("");
      setIsLogged(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  // Storage event listener
  useEffect(() => {
    const handleStorageChange = () => loadUserData();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLogged(false);
    setUserName("");
    setDropdownOpen(false);
    navigate("/");
    toast.success("Logged out successfully", toastConfig);
  };

  const navigateTo = (path) => {
    navigate(path === "Home" ? "/" : `/${path.toLowerCase().replace(/ /g, "")}`);
  };

  const goToWishlist = () => {
    if (!isLogged) {
      toast.error("Please login to view your wishlist", toastConfig);
      return;
    }
    navigate("/wishlist");
  };

  const goToCart = () => {
    if (!isLogged) {
      toast.error("Please login to view your cart", toastConfig);
      return;
    }
    navigate("/cart");
  };

  return (
    <nav className="bg-gray-100 text-gray-800 shadow-md border-b border-gray-300 relative">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 py-2">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer mr-6"
          onClick={() => navigateTo("Home")}
        >
          <img
            src="https://img.freepik.com/premium-vector/shoes-store-logo-template-design_316488-430.jpg"
            alt="Shoe Logo"
            className="w-12 h-12 md:w-14 md:h-14"
          />
          <span className="text-base md:text-lg font-bold">SHOES STORE</span>
        </div>

        {/* Menu Links */}
        <div className="flex flex-wrap items-center gap-4 text-base font-medium text-gray-700">
          {["Home", "About", "Men", "Women", "Best Deals", "Orders", "Our Story", "Contact"].map(
            (item, index) => (
              <span
                key={index}
                className="cursor-pointer hover:text-blue-500 transition-all duration-200"
                onClick={() => navigateTo(item)}
              >
                {item}
              </span>
            )
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          {/* Cart */}
          <div className="relative cursor-pointer" onClick={goToCart} aria-label="Cart">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3144/3144456.png"
              alt="Cart"
              className="w-6 h-6 md:w-7 md:h-7 hover:scale-110 transition-transform"
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* Wishlist */}
          <div className="relative cursor-pointer" onClick={goToWishlist} aria-label="Wishlist">
            <FaHeart size={20} className="text-black hover:text-red-500 transition-colors" />
          </div>

          {/* User Profile + Dropdown */}
          {isLogged ? (
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-2 cursor-pointer select-none rounded-full p-1 hover:bg-gray-200 transition"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title="User Profile"
              >
                <FaUserCircle size={28} className="text-gray-700" />
                {userName && (
                  <span className="hidden md:inline-block font-medium select-text">{userName}</span>
                )}
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg z-10">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 hover:scale-105"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
