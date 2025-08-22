import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RazorpayPayment from "../Razorpay/RazorpayPayment";
import { fetchUserProfile } from "../Api/userApi";
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from "../Api/addressApi";
import { getUserCart } from "../Api/cartApi";
import { motion } from "framer-motion";

const Payment = () => {
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    addressLine: "",
    pincode: ""
  });
  const [userId, setUserId] = useState(null);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const profileResponse = await fetchUserProfile();
        setUserProfile(profileResponse.data);
        setUserId(profileResponse.data.id);

        setNewAddress(prev => ({
          ...prev,
          fullName: profileResponse.data.fullName || "",
          email: profileResponse.data.email || ""
        }));

        const cartResponse = await getUserCart();
        const dbCart = cartResponse.data.map(item => ({
          ...item,
          productQuantity: item.quantity,
          productPrice: item.productPrice,
          productName: item.productName,
          productImageUrl: item.productImageUrl
        }));
        setCart(dbCart);

        if (dbCart.length === 0) {
          navigate("/");
          return;
        }

        await loadAddresses();
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
        setShowNewAddressForm(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const loadAddresses = async () => {
    try {
      const addressesResponse = await fetchAddresses();
      const addressesData = addressesResponse.data || [];
      setAddresses(addressesData);

      if (addressesData.length > 0) {
        setSelectedAddressId(addressesData[0].id);
        setShowNewAddressForm(false);
      } else {
        setShowNewAddressForm(true);
      }
    } catch (err) {
      console.error("Error loading addresses:", err);
      setShowNewAddressForm(true);
    }
  };

  const getSubtotal = () => {
    return cart.reduce((t, item) => t + item.productPrice * item.productQuantity, 0);
  };

  const getTotalPrice = () => {
    const subtotal = getSubtotal();
    if (paymentMethod === "Cash on Delivery") return subtotal * 1.05;
    return subtotal;
  };

 const handlePlaceOrder = (paymentStatus = "Pending") => {
  const finalAddress = selectedAddressId && addresses.length > 0
    ? addresses.find(a => a.id === selectedAddressId)
    : {
        fullName: newAddress.fullName,
        email: newAddress.email,
        phoneNumber: newAddress.phoneNumber,
        addressLine: newAddress.addressLine,
        pincode: newAddress.pincode,
      };

  const orderData = {
    items: cart,
    totalAmount: getTotalPrice(),
    paymentMethod,
    address: finalAddress,
    paymentStatus,
    userId,
  };

  console.log("Placing order:", orderData);

  // ✅ Remove ordered items from cart
  const remainingCart = [];
  cart.forEach(async (cartItem) => {
    // Remove from wishlist only if wishlistId exists
    if (cartItem.wishlistId) {
      try {
        await removeFromWishlist(cartItem.wishlistId);
      } catch (err) {
        console.error("Failed to remove wishlist item:", err);
      }
    }
    // Remove from cart
    try {
      await removeFromCart(cartItem.productId); // use your cart API remove
    } catch (err) {
      console.error("Failed to remove cart item:", err);
    }
  });

  localStorage.removeItem("checkoutCart");
  navigate("/orders");
};


  const handleRazorpaySuccess = () => handlePlaceOrder("Paid");
  const handleRazorpayFailure = () => alert("Payment Failed");

  const handleSaveAddress = async () => {
    if (!isAddressValid) return;

    try {
      const payload = {
       id: editingAddressId || 0,
        fullName: newAddress.fullName,
        email: newAddress.email,
        phoneNumber: newAddress.phoneNumber,
        addressLine: newAddress.addressLine,
        pincode: newAddress.pincode,
   
      };

      if (editingAddressId) {
        await updateAddress(editingAddressId, payload);
        setEditingAddressId(null);
      } else {
        await addAddress(payload);
      }

      await loadAddresses();
      setNewAddress({
        fullName: userProfile?.fullName || "",
        email: userProfile?.email || "",
        phoneNumber: "",
        addressLine: "",
        pincode: ""
      });
      setShowNewAddressForm(false);
    } catch (err) {
      console.error("Error saving address:", err.response?.data || err.message);
      setError("Failed to save address. Please try again.");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!id) {
      console.error("Cannot delete address: Invalid ID");
      setError("Cannot delete address: Invalid ID");
      return;
    }

    try {
      await deleteAddress(id);
      const updatedAddresses = addresses.filter(addr => addr.id !== id);
      setAddresses(updatedAddresses);

      if (selectedAddressId === id) {
        setSelectedAddressId(updatedAddresses.length > 0 ? updatedAddresses[0].id : null);
      }

      if (updatedAddresses.length === 0) {
        setShowNewAddressForm(true);
      }
    } catch (err) {
      console.error("Error deleting address:", err);
      setError("Failed to delete address. Please try again.");
    }
  };

  const handleEditAddress = (addr) => {
    if (!addr || !addr.id) {
      console.error("Cannot edit address: Invalid address data");
      setError("Cannot edit address: Invalid address data");
      return;
    }

    setEditingAddressId(addr.id);
    setNewAddress({
      fullName: addr.fullName || "",
      email: addr.email || "",
      phoneNumber: addr.phoneNumber || "",
      addressLine: addr.addressLine || "",
      pincode: addr.pincode || ""
    });
    setShowNewAddressForm(true);
  };

  const isAddressValid = 
    newAddress.fullName &&
    newAddress.email &&
    newAddress.phoneNumber &&
    newAddress.addressLine &&
    newAddress.pincode;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-xl">Loading addresses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button 
              onClick={() => setError("")}
              className="float-right text-red-800 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Delivery Address</h2>

            {addresses.length > 0 && !showNewAddressForm && (
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold mb-2">Saved Addresses</h3>
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`border p-4 rounded-lg ${selectedAddressId === addr.id ? "border-blue-500 bg-blue-50" : ""}`}
                  >
                    <p className="font-bold text-gray-800">Name: {addr.fullName}</p>
                    <p className="text-gray-600">Address: {addr.addressLine}, {addr.pincode}</p>
                    <p className="text-gray-600">Mobile: {addr.phoneNumber}</p>
                    
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`px-3 py-1 rounded ${
                          selectedAddressId === addr.id 
                            ? "bg-green-500 text-white hover:bg-green-600" 
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {selectedAddressId === addr.id ? "Selected" : "Choose this address"}
                      </button>
                      <button
                        onClick={() => handleEditAddress(addr)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-6">
              <button
                onClick={() => {
                  setShowNewAddressForm(!showNewAddressForm);
                  setEditingAddressId(null);
                  setNewAddress({
                    fullName: userProfile?.fullName || "",
                    email: userProfile?.email || "",
                    phoneNumber: "",
                    addressLine: "",
                    pincode: ""
                  });
                }}
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                {showNewAddressForm ? "← Choose from saved addresses" : "+ Add new address"}
              </button>
            </div>

            {showNewAddressForm && (
              <>
                <h3 className="text-lg font-semibold mb-2">{editingAddressId ? "Edit Address" : "Add New Address"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className="border p-3 rounded"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newAddress.email}
                    onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                    className="border p-3 rounded"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={newAddress.phoneNumber}
                    onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                    className="border p-3 rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    className="border p-3 rounded"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={newAddress.addressLine}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                    className="border p-3 rounded col-span-2"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveAddress}
                    disabled={!isAddressValid}
                    className={`px-6 py-2 rounded font-semibold ${
                      isAddressValid ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {editingAddressId ? "Save Changes" : "Save Address"}
                  </button>
                  {editingAddressId && (
                    <button
                      onClick={() => {
                        setEditingAddressId(null);
                        setShowNewAddressForm(false);
                        setNewAddress({
                          fullName: userProfile?.fullName || "",
                          email: userProfile?.email || "",
                          phoneNumber: "",
                          addressLine: "",
                          pincode: ""
                        });
                      }}
                      className="px-6 py-2 rounded font-semibold bg-gray-300 text-gray-600 hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </>
            )}

            {!showNewAddressForm && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedAddressId}
                  className={`px-6 py-2 rounded font-semibold ${
                    selectedAddressId ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Continue to Payment
                </button>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Payment Method</h2>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Delivery to:</h3>
              {selectedAddressId && addresses.length > 0 ? (
                <div>
                  <p className="font-bold text-gray-800">{addresses.find(a => a.id === selectedAddressId)?.fullName}</p>
                  <p className="text-gray-600">{addresses.find(a => a.id === selectedAddressId)?.addressLine}, {addresses.find(a => a.id === selectedAddressId)?.pincode}</p>
                  <p className="text-gray-600">Mobile: {addresses.find(a => a.id === selectedAddressId)?.phoneNumber}</p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-gray-800">{newAddress.fullName}</p>
                  <p className="text-gray-600">{newAddress.addressLine}, {newAddress.pincode}</p>
                  <p className="text-gray-600">Mobile: {newAddress.phoneNumber}</p>
                </div>
              )}
              <button 
                onClick={() => setStep(1)}
                className="text-blue-500 mt-2 text-sm"
              >
                Change address
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setPaymentMethod("Cash on Delivery")}
                className={`px-6 py-3 rounded border ${
                  paymentMethod === "Cash on Delivery"
                    ? "bg-green-500 text-white border-green-500"
                    : "hover:bg-gray-100"
                }`}
              >
                Cash on Delivery (+5%)
              </button>
              <button
                onClick={() => setPaymentMethod("Online Payment")}
                className={`px-6 py-3 rounded border ${
                  paymentMethod === "Online Payment"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "hover:bg-gray-100"
                }`}
              >
                Online Payment
              </button>
            </div>

            {/* Order Summary */}
            <div className="border rounded-lg p-4 shadow-md bg-white">
              <h2 className="text-xl font-bold mb-3">Order Summary</h2>

              {cart.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-4 border-b">
                  <img
                    src={item.productImageUrl}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 ml-4">
                    <p className="font-medium text-gray-800">{item.productName}</p>
                    <p className="text-sm text-gray-600">₹{item.productPrice} x {item.productQuantity}</p>
                  </div>
                  <div className="font-semibold text-gray-800">₹{item.productPrice * item.productQuantity}</div>
                </div>
              ))}

              <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                <span>Subtotal:</span>
                <span>₹{getSubtotal()}</span>
              </div>

              {paymentMethod === "Cash on Delivery" && (
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>COD Fee (5%):</span>
                  <span>₹{Math.round(getSubtotal() * 0.05)}</span>
                </div>
              )}

              <motion.div 
                className="border-t pt-2 mt-2 flex justify-between font-bold text-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span>Grand Total:</span>
                <span className="text-purple-600">₹{Math.round(getTotalPrice())}</span>
              </motion.div>
            </div>

            {paymentMethod === "Online Payment" ? (
              <div className="mt-6">
                <RazorpayPayment
                  amount={getTotalPrice()}
                  onSuccess={handleRazorpaySuccess}
                  onFailure={handleRazorpayFailure}
                />
              </div>
            ) : paymentMethod === "Cash on Delivery" ? (
              <button
                onClick={() => handlePlaceOrder("Pending")}
                className="bg-orange-500 text-white px-6 py-3 rounded mt-6 hover:bg-orange-600 w-full"
              >
                Place Order
              </button>
            ) : (
             <p className="text-red-600 font-bold animate-pulse text-center mt-2">
    Please select a payment method
  </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;