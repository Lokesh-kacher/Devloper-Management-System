import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("login"); // 'login' or 'otp'
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);
      alert(res.data.message);
      setStep("otp");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/verify-otp", {
        email: formData.email,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      alert("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      {step === "login" ? (
        <form
          onSubmit={handleLoginSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-[400px] border border-gray-200"
        >
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-8">Enter your credentials to continue</p>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full p-3 rounded-lg font-bold text-white transition-all ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
          >
            {loading ? "Processing..." : "Login"}
          </button>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?
            <Link to="/register" className="text-blue-600 font-semibold ml-2 hover:underline">
              Register
            </Link>
          </p>
        </form>
      ) : (
        <form
          onSubmit={handleOTPSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-[400px] border border-gray-200 animate-in fade-in duration-500"
        >
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
            Verify OTP
          </h2>
          <p className="text-center text-gray-500 mb-8">
            We've sent a 6-digit code to <br />
            <span className="font-semibold text-gray-700">{formData.email}</span>
          </p>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Enter 6-Digit Code</label>
            <input
              type="text"
              placeholder="000000"
              maxLength="6"
              className="w-full border p-4 text-center text-2xl font-bold tracking-[10px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full p-3 rounded-lg font-bold text-white transition-all ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'}`}
          >
            {loading ? "Verifying..." : "Verify & Login"}
          </button>

          <button 
            type="button"
            onClick={() => setStep("login")}
            className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Back to Login
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;