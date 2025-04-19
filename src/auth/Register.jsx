import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!name || !email || !password || !confirmPassword) {
      setError("⚠️ All fields are required!");
      return;
    }

    if (password.length < 6) {
      setError("⚠️ Password must be at least 6 characters!");
      return;
    }

    if (password !== confirmPassword) {
      setError("⚠️ Passwords do not match!");
      return;
    }

    try {

      // 🔥 Check if email already exists
      const res = await axios.get("https://json-sever-mru6.onrender.com/users");
      const existingUser = res.data.find((u) => u.email === email &&  u.password=== password);

      


      if (existingUser) {
        setError("❌ Email already registered! Try logging in.");
        return;
      }

      // New user object with an empty cart & orders
      const newUser = { name, email, password, cart: [], orders: [] };

      // Save to JSON server
      await axios.post("https://json-sever-mru6.onrender.com/users", newUser);

      // Redirect to login page after registration
      navigate("/login");
    } catch (error) {
      setError("⚠️ Registration failed! Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-2xl w-full max-w-sm md:w-[400px]">
        {/* Logo */}
        <img
          src="https://img.freepik.com/premium-vector/shoes-store-logo-template-design_316488-430.jpg"
          alt="Shoe Logo"
          className="w-32 h-32 mx-auto mb-7"
        />

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Create an Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        <form onSubmit={handleRegister} className="w-full space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-lg focus:ring-2 focus:ring-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-lg focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-lg focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-lg focus:ring-2 focus:ring-blue-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 rounded-lg text-lg font-semibold shadow-xl hover:scale-105 transition-transform duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-500 font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
