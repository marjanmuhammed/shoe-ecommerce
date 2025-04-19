import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa'; // Import FaHeart icon from react-icons

const Navbar = () => {
    const navigate = useNavigate();
    const [isLogged, setIsLogged] = useState(localStorage.getItem("isLoggedIn") === "true");
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalItems = storedCart.reduce((total, item) => total + item.quantity, 0);
        setCartCount(totalItems);
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
            const totalItems = storedCart.reduce((total, item) => total + item.quantity, 0);
            setCartCount(totalItems);

            setIsLogged(localStorage.getItem("isLoggedIn") === "true");
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleLogout = () => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    
        if (loggedInUser && loggedInUser.email) {
            const userOrdersKey = `orders_${loggedInUser.email}`;
            const userOrders = localStorage.getItem(userOrdersKey);
    
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("userId");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("cart");
    
            if (userOrders) {
                localStorage.setItem(userOrdersKey, userOrders);
            }
        } else {
            localStorage.clear();
        }
    
        setIsLogged(false);
        navigate("/login");
    };

    const navigateTo = (path) => {
        navigate(path === "Home" ? "/" : `/${path.toLowerCase().replace(/ /g, '')}`);
    };

    // Navigate to the wishlist page
    const goToWishlist = () => {
        navigate("/wishlist");
    };

    return (
        <nav className="bg-gray-100 text-gray-800 shadow-md border-b border-gray-300 relative">
            <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
                <div className="flex items-center space-x-3">
                    <img
                        src="https://img.freepik.com/premium-vector/shoes-store-logo-template-design_316488-430.jpg"
                        alt="Shoe Logo"
                        className="w-14 h-14 md:w-16 md:h-16"
                    />
                    <span className="text-lg md:text-xl font-bold hidden md:block">SHOES STORE</span>
                </div>

                <div className="hidden md:flex space-x-6 text-lg font-medium">
                    {["Home", "About", "Men", "Women", "Best Deals", "Orders", "Our Story", "Contact"].map((item, index) => (
                        <span
                            key={index}
                            className="hover:text-blue-500 cursor-pointer transition-all duration-200"
                            onClick={() => navigateTo(item)}
                        >
                            {item}
                        </span>
                    ))}
                </div>

                <div className="hidden md:flex items-center space-x-5">
                    {/* Cart Icon */}
                    <div className="relative cursor-pointer" onClick={() => navigateTo("cart")}> 
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3144/3144456.png"
                            alt="Cart"
                            className="w-7 h-7 md:w-8 md:h-8 hover:scale-110 transition-transform"
                        />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </div>

                    {/* Wishlist Icon (Heart) */}
                    <div className="relative cursor-pointer" onClick={goToWishlist}> 
                        <FaHeart
                            size={24}
                            className="text-black" // Keep heart color static, no hover effect
                        />
                    </div>

                    {/* Login/Logout Button */}
                    {isLogged ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 hover:scale-105"
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 hover:scale-105"
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
