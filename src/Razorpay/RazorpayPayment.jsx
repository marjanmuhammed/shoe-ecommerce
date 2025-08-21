import React from "react";

const RazorpayPayment = ({ amount, onSuccess, onFailure }) => {
  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => openRazorpay();
    document.body.appendChild(script);
  };

  const openRazorpay = () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // Replace with your key
      amount: amount * 100, // in paise
      currency: "INR",
      name: "My Shoe Store",
      description: "Payment for Order",
      handler: function (response) {
        onSuccess(response);
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", onFailure);
    rzp.open();
  };

  return (
    <button
      onClick={loadRazorpay}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg"
    >
      Pay with Razorpay
    </button>
  );
};

export default RazorpayPayment;
