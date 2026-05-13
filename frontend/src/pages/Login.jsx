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
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState("login"); // 'login', 'otp', 'forgot', 'reset'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await API.post("/auth/login", formData);
      setMessage({ text: res.data.message, type: "success" });
      setStep("otp");
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Login failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await API.post("/auth/verify-otp", {
        email: formData.email,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "OTP verification failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await API.post("/auth/forgot-password", { email: formData.email });
      setMessage({ text: res.data.message, type: "success" });
      setStep("reset");
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Failed to send reset OTP", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await API.post("/auth/reset-password", {
        email: formData.email,
        otp,
        newPassword,
      });
      setMessage({ text: res.data.message, type: "success" });
      setTimeout(() => setStep("login"), 2000);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Reset failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      {step === "login" && (
        <form
          onSubmit={handleLoginSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-[400px] border border-gray-200 animate-in fade-in duration-300"
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

          <div className="mb-2">
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

          <div className="flex justify-end mb-6">
            <button 
              type="button" 
              onClick={() => { setStep("forgot"); setMessage({ text: "", type: "" }); }}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full p-3 rounded-lg font-bold text-white transition-all ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
          >
            {loading ? "Processing..." : "Login"}
          </button>

          {message.text && (
            <p className={`mt-4 text-center text-sm font-medium p-3 rounded-lg ${
              message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}>
              {message.text}
            </p>
          )}

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?
            <Link to="/register" className="text-blue-600 font-semibold ml-2 hover:underline">
              Register
            </Link>
          </p>
        </form>
      )}

      {step === "otp" && (
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

          {message.text && (
            <p className={`mt-4 text-center text-sm font-medium p-3 rounded-lg ${
              message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}>
              {message.text}
            </p>
          )}

          <button 
            type="button"
            onClick={() => { setStep("login"); setMessage({ text: "", type: "" }); }}
            className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Back to Login
          </button>
        </form>
      )}

      {step === "forgot" && (
        <form
          onSubmit={handleForgotPasswordSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-[400px] border border-gray-200 animate-in fade-in duration-300"
        >
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
            Reset Password
          </h2>
          <p className="text-center text-gray-500 mb-8">Enter your email to receive a reset code</p>

          <div className="mb-6">
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

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full p-3 rounded-lg font-bold text-white transition-all ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>

          {message.text && (
            <p className={`mt-4 text-center text-sm font-medium p-3 rounded-lg ${
              message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}>
              {message.text}
            </p>
          )}

          <button 
            type="button"
            onClick={() => { setStep("login"); setMessage({ text: "", type: "" }); }}
            className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Back to Login
          </button>
        </form>
      )}

      {step === "reset" && (
        <form
          onSubmit={handleResetPasswordSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-[400px] border border-gray-200 animate-in fade-in duration-300"
        >
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
            Set New Password
          </h2>
          <p className="text-center text-gray-500 mb-8">Enter the code sent to your email and your new password</p>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reset Code</label>
            <input
              type="text"
              placeholder="000000"
              maxLength="6"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center font-bold tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full p-3 rounded-lg font-bold text-white transition-all ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'}`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {message.text && (
            <p className={`mt-4 text-center text-sm font-medium p-3 rounded-lg ${
              message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            }`}>
              {message.text}
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default Login;