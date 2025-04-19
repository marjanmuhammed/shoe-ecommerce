import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbarcontext/Navbar";


const Cart = () => {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    // Fetch cart from localStorage
    const fetchCart = () => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    };

    // Update cart in localStorage
    const updateCart = (updatedCart) => {
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Increase quantity
    const increaseQuantity = (id) => {
        const updatedCart = cart.map(item => 
            item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
        updateCart(updatedCart);
    };

    // Decrease quantity
    const decreaseQuantity = (id) => {
        const updatedCart = cart.map(item => 
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        );
        updateCart(updatedCart);
    };

    // Remove item from cart
    const removeItem = (id) => {
        const updatedCart = cart.filter(item => item.id !== id);
        updateCart(updatedCart);
    };

    // Calculate total amount
    const totalAmount = cart.reduce((total, item) => total + (parseFloat(item.price) * (item.quantity || 1)), 0);

    // Handle Checkout
    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }
        

        // Store the cart in localStorage for checkout page
        localStorage.setItem("checkoutCart", JSON.stringify(cart));

        // Empty the cart after checkout
        localStorage.removeItem("cart");
        setCart([]); // Update the state to empty the cart

        // Navigate to payment page
        navigate("/pay");
    };

    return (
        <div className="container mx-auto p-6">
            <Navbar/>
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Cart</h1>

            {cart.length === 0 ? (
                <p className="text-gray-500 text-center">Your cart is empty.</p>
            ) : (
                <>
                    <ul className="space-y-6">
                        {cart.map((item) => (
                            <li key={item.id} className="flex items-center justify-between p-6 border rounded-lg shadow-lg bg-white">
                                <div className="flex items-center space-x-6">
                                    <img src={item.image_url} alt={item.name} className="w-28 h-28 object-contain rounded-lg"/>
                                    <div>
                                        <h2 className="font-semibold text-xl">{item.name}</h2>
                                        <p className="text-lg">Price: <span className="font-bold text-green-600">${item.price}</span></p>
                                        <div className="flex items-center space-x-4 mt-2">
                                            <button onClick={() => decreaseQuantity(item.id)} className="bg-gray-300 px-3 py-1 rounded">-</button>
                                            <span className="text-lg font-semibold">{item.quantity || 1}</span>
                                            <button onClick={() => increaseQuantity(item.id)} className="bg-gray-300 px-3 py-1 rounded">+</button>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-800">Remove</button>
                            </li>
                        ))}
                    </ul>

                    <div className="text-center mt-6">
                        <h2 className="text-2xl font-bold">Total Amount: <span className="text-green-600">${totalAmount.toFixed(2)}</span></h2>

                        
                        <button
                            onClick={handleCheckout}
                            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-all duration-300"
                        >
                            Proceed to Checkout
                        </button>
                       
                    </div>
                </>
              
            )}
            
        </div>
        
    );
};

export default Cart;
