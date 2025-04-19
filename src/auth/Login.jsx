import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("⚠️ All fields are required!");
      return;
    }

    try {
      const userOrdersKey = `orders_${email}`;
      const existingOrders = localStorage.getItem(userOrdersKey);

      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("isAdmin");

      if (email === "admin@gmail.com" && password === "0000") {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("adminEmail", email);
        localStorage.setItem("adminPassword", password);
        navigate("/dashboard");
        return;
      }

      const { data: users } = await axios.get("http://localhost:3000/users");
      const user = users.find((u) => u.email === email && u.password === password);

      console.log("User found:", user); // Debug log

      if (user) {
        if (user.blocked) {
          console.log("User is blocked:", user.blocked); // Debug log
          setError("❌ Your account has been blocked. Contact admin.");
          return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify(user));
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("isLoggedIn", "true");

        localStorage.setItem(userOrdersKey, existingOrders || JSON.stringify([]));

        setError("");
        navigate("/");
      } else {
        setError("❌ Invalid email or password!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("⚠️ Error logging in. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96 flex flex-col items-center">
        {/* Logo Centered */}
        <img
          src="https://img.freepik.com/premium-vector/shoes-store-logo-template-design_316488-430.jpg"
          alt="Shoe Logo"
          className="w-24 h-24 mb-4"
        />
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4 w-full">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg transition duration-300 hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/register")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
