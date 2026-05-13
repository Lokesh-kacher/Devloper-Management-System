import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await API.post("/auth/register", formData);
      setMessage({ text: "Registration Successful! Redirecting...", type: "success" });
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Registration failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-[400px] border border-gray-200 animate-in fade-in duration-300"
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-8">Join our developer management system</p>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="name@company.com"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            onChange={handleChange}
            required
          />
        </div>

        <button 
          disabled={loading}
          className={`w-full p-3 rounded-lg font-bold text-white transition-all ${loading ? 'bg-muted' : 'bg-primary hover:opacity-90 shadow-md hover:shadow-lg'}`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {message.text && (
          <p className={`mt-4 text-center text-sm font-medium p-3 rounded-lg ${
            message.type === "success" ? "bg-accent text-gray-800" : "bg-red-50 text-red-600"
          }`}>
            {message.text}
          </p>
        )}

        <p className="mt-6 text-center text-gray-600">
          Already have an account?
          <Link to="/" className="text-primary font-semibold ml-2 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;