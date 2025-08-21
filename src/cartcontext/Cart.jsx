// 🔥 Important change: no redirect, only toast if user not logged in
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbarcontext/Navbar";
import { getUserCart, updateCartItem, removeCartItem } from "../Api/cartApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toastConfig = {
    position: "top-center",
    autoClose: 1500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  const isLogged = () => localStorage.getItem("isLoggedIn") === "true";

  const fetchCart = useCallback(async () => {
    if (!isLogged()) {
      toast.info("Please login to view your cart", toastConfig);
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await getUserCart(); // interceptor will handle token refresh
      setCart(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const updateQuantity = async (id, quantity) => {
    if (!isLogged()) { 
      toast.error("Please login to update cart items", toastConfig); 
      return; 
    }
    if (quantity < 1) return;
    try { 
      await updateCartItem(id, quantity);
      setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    } catch (e) { 
      console.error(e);
      toast.error("Failed to update quantity", toastConfig);
    }
  };

  const removeItem = async (id) => {
    if (!isLogged()) { 
      toast.error("Please login to remove cart items", toastConfig); 
      return; 
    }
    try { 
      await removeCartItem(id); 
      fetchCart(); 
    } catch (e) { 
      console.error(e);
      toast.error("Failed to remove item", toastConfig);
    }
  };

  const totalAmount = cart.reduce((total, item) => total + (parseFloat(item.productPrice) || 0) * (item.quantity || 1), 0);

  const handleCheckout = () => {
    if (!isLogged()) { 
      toast.info("Please login to checkout", toastConfig); 
      return; 
    }
    if (cart.length === 0) { 
      toast.info("Your cart is empty.", toastConfig); 
      return; 
    }
    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    navigate("/pay");
  };

  if (loading) return <p className="text-center mt-6">Loading your cart...</p>;

  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 mt-4">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center">
          {isLogged() ? "Your cart is empty." : "Please login to view your cart."}
        </p>
      ) : (
        <>
          <ul className="space-y-6 px-4 md:px-0 max-w-4xl mx-auto">
            {cart.map(item => (
              <li key={item.id || item.cartItemId} className="flex flex-col md:flex-row items-center justify-between p-6 border rounded-lg shadow-lg bg-white">
                <div className="flex items-center space-x-6">
                  <img src={item.productImageUrl} alt={item.productName} className="w-28 h-28 object-contain rounded-lg"/>
                  <div>
                    <h2 className="font-semibold text-xl">{item.productName}</h2>
                    <p className="text-gray-600">{item.productDescription}</p>
                    <p className="text-lg">Price: <span className="font-bold text-green-600">₹{item.productPrice}</span></p>
                    <div className="flex items-center space-x-4 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="bg-gray-300 px-3 py-1 rounded">-</button>
                      <span className="text-lg font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-gray-300 px-3 py-1 rounded">+</button>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id || item.cartItemId)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-800 mt-4 md:mt-0">Remove</button>
              </li>
            ))}
          </ul>

          <div className="text-center mt-6 px-4 md:px-0 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold">Total Amount: <span className="text-green-600">₹{totalAmount.toFixed(2)}</span></h2>
            <button onClick={handleCheckout} className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-all duration-300">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};


export default Cart;
