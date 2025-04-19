// import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [address, setAddress] = useState({
        name: "",
        address: "",
        city: "",
        zipCode: "",
        phoneNumber: ""
    });
    const [isPaymentFormVisible, setPaymentFormVisible] = useState(false);
    const [isOrderPlaced, setOrderPlaced] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve the cart stored in localStorage for checkout
        const storedCart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
        setCart(storedCart);

        // Check if the user is logged in
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (loggedInUser) {
            setUser(loggedInUser);
        } else {
            navigate("/login"); // Redirect to login if not logged in
        }
    }, [navigate]);

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePayment = () => {
        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        if (paymentMethod === "Online Payment") {
            setPaymentFormVisible(true); // Show Online Payment Form
        } else {
            setOrderPlaced(true);
        }
    };

    const handlePlaceOrder = () => {
        if (address.name && address.address && address.city && address.zipCode && address.phoneNumber) {
            // Clear the cart after order is placed
            localStorage.removeItem("checkoutCart");
            setOrderPlaced(true);
            alert("Order placed successfully!");
            navigate("/"); // Redirect to Home after placing the order
        } else {
            alert("Please fill in all the address details.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800">Payment Page</h1>
            <p className="text-center text-gray-600 mt-4">Complete your payment here.</p>

            {/* Cart Products Display */}
            <div className="mt-6 bg-white shadow-lg p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                {cart.length === 0 ? (
                    <p className="text-gray-500">No items in cart.</p>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center space-x-4">
                                <img src={item.image_url} alt={item.name} className="w-24 h-24 object-contain rounded-lg shadow-md" />
                                <div>
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p className="text-gray-700">Price: <span className="font-bold text-green-600">${item.price}</span></p>
                                    <p className="text-gray-700">Quantity: <span className="font-bold">{item.quantity}</span></p>
                                </div>
                            </div>
                            <p className="text-lg font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))
                )}
                <h3 className="text-xl font-semibold text-gray-800 mt-4">Total Amount: <span className="text-green-600">${getTotalPrice()}</span></h3>
            </div>

            {/* Address Form */}
            <div className="mt-6 bg-white shadow-lg p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Delivery Details</h2>
                <form className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={address.name}
                        onChange={handleAddressChange}
                        placeholder="Full Name"
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        value={address.address}
                        onChange={handleAddressChange}
                        placeholder="Address"
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                    <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleAddressChange}
                        placeholder="City"
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                    <input
                        type="text"
                        name="zipCode"
                        value={address.zipCode}
                        onChange={handleAddressChange}
                        placeholder="Zip Code"
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                    <input
                        type="text"
                        name="phoneNumber"
                        value={address.phoneNumber}
                        onChange={handleAddressChange}
                        placeholder="Phone Number"
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                </form>
            </div>

            {/* Payment Method Selection */}
            <div className="mt-6 bg-white shadow-lg p-6 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Method</h2>
                <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                        <input type="radio" name="payment" value="Cash on Delivery" onChange={(e) => setPaymentMethod(e.target.value)} />
                        <span className="text-gray-700">Cash on Delivery</span>
                    </label>
                    <label className="flex items-center space-x-3">
                        <input type="radio" name="payment" value="Online Payment" onChange={(e) => setPaymentMethod(e.target.value)} />
                        <span className="text-gray-700">Online Payment</span>
                    </label>
                </div>
            </div>

            {/* Online Payment Form (shown when Online Payment is selected) */}
            {isPaymentFormVisible && paymentMethod === "Online Payment" && (
                <div className="mt-6 bg-white shadow-lg p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Online Payment Details</h2>
                    <form className="space-y-4">
                        <input type="text" placeholder="Card Number" className="w-full p-3 border rounded-lg" required />
                        <input type="text" placeholder="Expiration Date" className="w-full p-3 border rounded-lg" required />
                        <input type="text" placeholder="CVV" className="w-full p-3 border rounded-lg" required />
                    </form>
                </div>
            )}

            {/* Place Order Button */}
            <div className="text-center mt-6">
                <button
                    onClick={handlePlaceOrder}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-all duration-300"
                >
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default Payment;
