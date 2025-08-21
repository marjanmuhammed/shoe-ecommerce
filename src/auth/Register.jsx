import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Api/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

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
      await registerUser({
        fullName: name,
        emailAddress: email,
        password: password,
        confirmPassword: confirmPassword,
      });

      toast.success("Registration completed successfully! 🎉", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate("/login");
      }, 3500); // delay navigation so user sees toast
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.errors) {
          const messages = Object.values(data.errors).flat().join(" ");
          setError(messages);
        } else if (data.title) {
          setError(data.title);
        } else {
          setError("⚠️ Registration failed! Please try again.");
        }
      } else {
        setError("⚠️ Registration failed! Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-2xl w-full max-w-sm md:w-[400px]">
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
      <ToastContainer />
    </div>
  );
}
