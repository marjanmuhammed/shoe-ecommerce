import { button } from "framer-motion/client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
    const [cart, setCart] = useState([]);
    const [newAddress, setNewAddress] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        pincode: ""
    });
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [selectedOnlinePayment, setSelectedOnlinePayment] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState({
        upiId: "",
        mobileNumber: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        bankName: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
        setCart(storedCart);
        if (storedCart.length === 0) navigate("/");
    }, [navigate]);

    const getTotalPrice = () => {
        let total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        if (paymentMethod === "Cash on Delivery") {
            total += total * 0.05; // 5% extra for COD
        }
        return total.toFixed(2);
    };

    const handleNextStep = () => {
        const { fullName, email, phone, address, pincode } = newAddress;
        if (!fullName || !email || !phone || !address || !pincode) {
            alert("⚠️ Please fill all address fields.");
            return;
        }
        setStep(2);
    };
    const handlePlaceOrder = () => {
        if (!paymentMethod) {
            alert("⚠️ Please select a payment method.");
           
            return;

        }
    
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!loggedInUser) {
            alert("⚠️ Please log in to place an order.");
            navigate("/login")
            return;
        }
       
    
        const userOrdersKey = `orders_${loggedInUser.email}`;
        const previousOrders = JSON.parse(localStorage.getItem(userOrdersKey)) || [];
    
        const newOrder = {
            id: Date.now(),
            items: cart.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image_url: item.image_url,
            })),
            totalAmount: getTotalPrice(),
            paymentMethod: paymentMethod,
            address: newAddress
        };
    
        // Update orders in localStorage
        const updatedOrders = [...previousOrders, newOrder];
        localStorage.setItem(userOrdersKey, JSON.stringify(updatedOrders));
    
        // ✅ Only clear checkoutCart, NOT user's cart
        localStorage.removeItem("checkoutCart");
        setCart([]);
    
        // ✅ Navigate to orders page
        navigate("/orders");
    };
    
    
    return (
        <div className="min-h-screen bg-gray-900 p-6 flex justify-center items-center">
            <div className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-2xl">
                {step === 1 && (
                    <>
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">Delivery Address</h2>
                        <div className="space-y-4">
                            <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg"
                                value={newAddress.fullName}
                                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} />
                            <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg"
                                value={newAddress.email}
                                onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })} />
                            <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded-lg"
                                value={newAddress.phone}
                                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
                            <input type="text" placeholder="Address" className="w-full p-3 border rounded-lg"
                                value={newAddress.address}
                                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} />
                            <input type="text" placeholder="Pincode" className="w-full p-3 border rounded-lg"
                                value={newAddress.pincode}
                                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                        </div>
                        <button onClick={handleNextStep} className="bg-blue-500 text-white px-6 py-3 rounded-lg mt-6 w-full">
                            Continue
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className="text-3xl font-bold mt-8 mb-6 text-gray-800">Payment Method</h2>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button onClick={() => setPaymentMethod("Cash on Delivery")} 
                                className={`px-6 py-3 rounded-lg ${paymentMethod === "Cash on Delivery" ? "bg-green-500 text-white" : "border border-gray-300 text-gray-800"}`}>
                                Cash on Delivery (+5% charge)
                            </button>
                            <button onClick={() => setPaymentMethod("Online Payment")} 
                                className={`px-6 py-3 rounded-lg ${paymentMethod === "Online Payment" ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-800"}`}>
                                💳 Online Payment
                            </button>
                        </div>

                        {paymentMethod === "Online Payment" && (
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {["UPI", "Wallets", "Credit Card", "Debit Card", "Net Banking", "EMI"].map((option) => (
                                    <button key={option} onClick={() => setSelectedOnlinePayment(option)}
                                        className={`border p-3 rounded-lg ${selectedOnlinePayment === option ? "bg-blue-500 text-white" : ""}`}>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}


{selectedOnlinePayment === "Wallets" && (
                            <p className="text-red-500 font-semibold mt-2">Paytm Wallet Coming Soon</p>
                        )}

{selectedOnlinePayment === "UPI" && (
    <div className="space-y-4 mb-6">
        <input type="text" placeholder="UPI ID" className="w-full p-3 border rounded-lg"
            value={paymentDetails.upiId}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })} />
            
        <input type="tel" placeholder="Registered Mobile Number" className="w-full p-3 border rounded-lg"
            maxLength={10}
            value={paymentDetails.registeredMobile}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, registeredMobile: e.target.value })} />
    </div>
)}


                        {(selectedOnlinePayment === "Credit Card" || selectedOnlinePayment === "Debit Card") && (
                            <div className="space-y-4 mb-6">
                                <input type="text" placeholder="Card Number (16 digits)" className="w-full p-3 border rounded-lg"
                                    maxLength={16}
                                    value={paymentDetails.cardNumber}
                                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })} />
                                <input type="text" placeholder="Valid Thru (MM/YY)" className="w-full p-3 border rounded-lg"
                                    value={paymentDetails.expiryDate}
                                    onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })} />
                                <input type="password" placeholder="CVV (3 digits)" className="w-full p-3 border rounded-lg"
                                    maxLength={3}
                                    value={paymentDetails.cvv}
                                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })} />
                            </div>



                        )}

{selectedOnlinePayment === "Net Banking" && (
    <div className="space-y-4 mb-6">
        <select className="w-full p-3 border rounded-lg"
            value={paymentDetails.bankName}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, bankName: e.target.value })}>
            <option value="">Select Your Bank</option>
            <option value="SBI">State Bank of India</option>
            <option value="HDFC">HDFC Bank</option>
            <option value="ICICI">ICICI Bank</option>
            <option value="Axis">Axis Bank</option>
            <option value="PNB">Punjab National Bank</option>
            <option value="BOI">Bank of India</option>
        </select>

        <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg"
            value={paymentDetails.fullName}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, fullName: e.target.value })} />

        <input type="text" placeholder="Surname" className="w-full p-3 border rounded-lg"
            value={paymentDetails.surname}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, surname: e.target.value })} />

        <input type="text" placeholder="Address" className="w-full p-3 border rounded-lg"
            value={paymentDetails.address}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, address: e.target.value })} />

        <input type="text" placeholder="Account Number" className="w-full p-3 border rounded-lg"
            value={paymentDetails.accountNumber}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })} />

        <input type="text" placeholder="IFSC Code" className="w-full p-3 border rounded-lg"
            value={paymentDetails.ifscCode}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, ifscCode: e.target.value })} />
    </div>
)}
{selectedOnlinePayment === "EMI" && (
    <div className="space-y-4 mb-6">
        {/* Bank Selection */}
        <select className="w-full p-3 border rounded-lg"
            value={paymentDetails.bankName}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, bankName: e.target.value })}>
            <option value="">Select Your Bank</option>
            <option value="SBI">State Bank of India</option>
            <option value="HDFC">HDFC Bank</option>
            <option value="ICICI">ICICI Bank</option>
            <option value="Axis">Axis Bank</option>
            <option value="PNB">Punjab National Bank</option>
            <option value="BOI">Bank of India</option>
        </select>

        {/* EMI Duration Selection */}
        <select className="w-full p-3 border rounded-lg"
            value={paymentDetails.emiDuration}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, emiDuration: e.target.value })}>
            <option value="">Select EMI Duration</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="9">9 Months</option>
            <option value="12">12 Months</option>
            <option value="18">18 Months</option>
            <option value="24">24 Months</option>
        </select>

        {/* EMI Details Form */}
        <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg"
            value={paymentDetails.fullName}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, fullName: e.target.value })} />

        <input type="text" placeholder="Surname" className="w-full p-3 border rounded-lg"
            value={paymentDetails.surname}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, surname: e.target.value })} />

        <input type="text" placeholder="Address" className="w-full p-3 border rounded-lg"
            value={paymentDetails.address}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, address: e.target.value })} />

        <input type="text" placeholder="Account Number" className="w-full p-3 border rounded-lg"
            value={paymentDetails.accountNumber}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })} />

        <input type="text" placeholder="IFSC Code" className="w-full p-3 border rounded-lg"
            value={paymentDetails.ifscCode}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, ifscCode: e.target.value })} />

        <input type="text" placeholder="Monthly EMI Amount" className="w-full p-3 border rounded-lg"
            value={paymentDetails.emiAmount}
            onChange={(e) => setPaymentDetails({ ...paymentDetails, emiAmount: e.target.value })} />

       
    </div>
)}

                        <h3 className="text-2xl font-semibold mt-6 mb-4">Total: <span className="text-green-600">${getTotalPrice()}</span></h3>
                        <button onClick={handlePlaceOrder} className="bg-orange-500 text-white px-8 py-3 rounded-xl text-lg font-semibold w-full shadow-lg mt-4">
                            Place Order
                           
                        </button>
                       
                    </>
                )}
            </div>
        </div>
    );
};

export default Payment;
