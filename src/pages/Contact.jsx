import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2"; // Import SweetAlert2

import Navbar from "../Navbarcontext/Navbar";
import Footer from "../footercomponent/Footer";
import { FaFacebook, FaTwitter, FaYoutube, FaShoppingCart, FaPaperPlane } from "react-icons/fa";

const Contact = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validate Email
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Send Email
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isValidEmail(formData.email)) {
            Swal.fire("Invalid Email", "Please enter a valid email address.", "error");
            return;
        }

        emailjs
            .send(
                "service_432l4d2", // Replace with your EmailJS Service ID
                "your_template_id", // Replace with your EmailJS Template ID
                formData,
                "your_public_key" // Replace with your EmailJS Public Key
            )
            .then(() => {
                Swal.fire("Success!", "Your message has been sent. We will reply soon!", "success");
                setFormData({ name: "", email: "", message: "" }); // Clear form
            })
            .catch((error) => {
                console.error("Email Error:", error);
                Swal.fire("Error", "Something went wrong. Please try again later.", "error");
            });
    };

    return (
        <>
            <Navbar />
            <div className="bg-gradient-to-r from-blue-50 to-gray-100 min-h-screen p-10">
                <div className="max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-lg">
                    <h1 className="text-5xl font-bold text-center text-gray-900 mb-8">📞 Contact Us</h1>

                    {/* Contact Form */}
                    <div className="bg-gray-50 p-8 rounded-lg shadow-md mb-12">
                        <h3 className="text-3xl font-semibold mb-6 text-center">✉️ Stay in Touch</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-lg font-medium text-gray-700">Your Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    className="w-full p-4 border rounded-md text-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700">Your Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="w-full p-4 border rounded-md text-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700">Your Message *</label>
                                <textarea
                                    name="message"
                                    placeholder="Write your message here..."
                                    className="w-full p-4 border rounded-md text-lg focus:ring-2 focus:ring-blue-500"
                                    rows="5"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-8 py-4 rounded-md w-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition">
                                <FaPaperPlane /> Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Details */}
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="p-6 bg-blue-100 rounded-lg shadow-md text-center">
                            <h3 className="text-xl font-semibold">📦 Products & Orders</h3>
                            <p className="text-gray-700 text-lg">(+1) 123-456-7890</p>
                            <p className="text-gray-600 text-sm">Available 24/7</p>
                        </div>
                        <div className="p-6 bg-blue-100 rounded-lg shadow-md text-center">
                            <h3 className="text-xl font-semibold">📩 Info & Enquiries</h3>
                            <p className="text-gray-700 text-lg">support@shoestore.com</p>
                            <p className="text-gray-600 text-sm">We respond within 24 hours</p>
                        </div>
                        <div className="p-6 bg-blue-100 rounded-lg shadow-md text-center">
                            <h3 className="text-xl font-semibold">📍 Store Locator</h3>
                            <p className="text-gray-700 text-lg">Find our retail stores near you</p>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="flex justify-center space-x-8 text-3xl text-gray-700 mb-12">
                        <FaFacebook className="cursor-pointer hover:text-blue-600 transition" />
                        <FaTwitter className="cursor-pointer hover:text-blue-400 transition" />
                        <FaYoutube className="cursor-pointer hover:text-red-500 transition" />
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                        <h3 className="text-3xl font-semibold mb-6 text-center">❓ Frequently Asked Questions</h3>
                        <ul className="space-y-4 text-gray-700 text-lg">
                            <li>🔹 How can I track my order?</li>
                            <li>🔹 Do you offer international shipping?</li>
                            <li>🔹 What is your return policy?</li>
                            <li>🔹 How can I contact customer service?</li>
                            <li>🔹 Do you provide discounts for bulk orders?</li>
                        </ul>
                    </div>

                    {/* Shop Now Button */}
                    <div className="text-center mt-10">
                        <button
                            onClick={() => navigate("/")}
                            className="bg-green-500 text-white px-8 py-4 rounded-md text-xl font-bold flex items-center mx-auto gap-2 hover:bg-green-600 transition">
                            <FaShoppingCart /> Shop Now
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Contact;
