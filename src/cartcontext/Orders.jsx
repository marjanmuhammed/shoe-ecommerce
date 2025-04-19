import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchOrders = () => {
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            
            if (loggedInUser && loggedInUser.email) {
                const userOrdersKey = `orders_${loggedInUser.email}`;
                const userOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];
                setOrders(userOrders);
            } else {
                setOrders([]); // Clear orders if no user is logged in
            }
        };

        fetchOrders();
        window.addEventListener("storage", fetchOrders); // Update if localStorage changes
        return () => window.removeEventListener("storage", fetchOrders);
    }, []);
    return (
        <div className="max-w-5xl mx-auto px-6 py-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">📦 My Orders</h2>

            {orders.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No orders found.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div cd
                            key={order.id} 
                            className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition duration-300"
                        >
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-semibold text-gray-800">
                                    Order ID: <span className="text-gray-900">{order.id}</span>
                                </h4>
                                <span 
                                    className={`px-3 py-1 text-sm font-semibold text-white rounded-md 
                                        ${order.paymentMethod === "Cash on Delivery" ? "bg-green-500" : "bg-blue-500"}`}
                                >
                                    {order.paymentMethod}
                                </span>
                            </div>

                            <p className="text-gray-700 mt-2">
                                <strong>Total Amount:</strong> 
                                <span className="text-green-600 font-bold"> ${Number(order.totalAmount).toFixed(2)}</span>
                            </p>
                            <p className="text-gray-700">
                                <strong>Shipping Address:</strong> {order.address.fullName}, {order.address.address}, {order.address.pincode}
                            </p>

                            {/* Order Status */}
                            <div className="mt-4">
                                <p className="text-lg font-semibold text-gray-800">
                                    📦 Order Status: 
                                    <span className="text-blue-600"> Wait For The Update 🚚</span>
                                </p>
                                <p className="text-red-600 text-sm animate-pulse hover:animate-none">
                                    ⚡ We are updating you soon...
                                </p>
                            </div>

                       {/* Ordered Items */}
{/* Ordered Items */}
<div className="mt-4 border-t pt-4">
    <h4 className="text-lg font-semibold text-gray-800 mb-2">🛍️ Items Ordered:</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {order.items.map((item, index) => (
            <div 
                key={index} 
                className="flex flex-col items-center bg-gray-100 p-4 rounded-lg hover:shadow-md transition duration-300"
            >
                        <img 
    src={item.image_url || "https://via.placeholder.com/100"} 
    alt={item.name} 
    className="w-24 h-24 object-contain rounded-lg"
/>


                <p className="font-medium text-gray-900 mt-2">{item.name}</p>
                <p className="text-gray-600">
                    <span className="text-green-600 font-bold">${item.price}</span> x {item.quantity}
                </p>
            </div>
        ))}
    </div>
</div>


                            {/* Out for Delivery Button */}
                            <div className="mt-4 text-center">
                                <button 
                                    onClick={() => navigate(`/track-order/${order.id}`)}
                                    className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
                                >
                                    🚛 Track Order (Out for Delivery)
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Continue Shopping Button */}
            <div className="text-center mt-10">
                <button 
                    onClick={() => navigate("/")} 
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                    🛒 Continue Shopping
                </button>
            </div>
        </div>
    );
};

export default Orders;
