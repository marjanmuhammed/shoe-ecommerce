import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Api/auth";
import api from "../Api/axiosSetup"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      const oldUserEmail = localStorage.getItem("userEmail");

      if (oldUserEmail && oldUserEmail !== email) {
        localStorage.removeItem(`cart_${oldUserEmail}`);
      }

      const response = await loginUser({ emailAddress: email, password });

      const { token, refreshToken, role, isBlocked } = response;

      if (isBlocked) {
        toast.error("❌ Your account is blocked. Contact admin support.");
        return;
      }

      // Save tokens + user info
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("loggedInUser", JSON.stringify({ email, role }));
      localStorage.setItem("userEmail", email);
      localStorage.setItem("isLoggedIn", "true");

      // Separate cart for each user
      const userCartKey = `cart_${email}`;
      if (!localStorage.getItem(userCartKey)) localStorage.setItem(userCartKey, JSON.stringify([]));

      // Set axios instance header
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setError("");

      if (role?.toLowerCase() === "admin") {
        toast.success("🎉 Admin Login Successful!");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        toast.success("🎉 Login Successful!");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("❌ Invalid email or password");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md w-96 flex flex-col items-center">
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

      <ToastContainer position="top-center" autoClose={1500} theme="colored" />
    </>
  );
}
