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
    <div className="min-h-screen flex flex-col justify-center items-center bg-main-bg font-tnr p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tighter">Program Manager</h1>
        <p className="text-[10px] text-gray-400 font-bold tracking-[3px] uppercase mt-1"></p>
      </div>

      <div className="w-full max-w-[420px] bg-white p-10 rounded-[32px] border border-card-border shadow-2xl shadow-primary/5 animate-in fade-in zoom-in-95 duration-500">
        {step === "login" && (
          <form onSubmit={handleLoginSubmit}>
            <h2 className="text-3xl font-bold mb-2 text-gray-900 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 mb-8 font-medium">Enter your details to access your workspace.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  className="w-full border border-card-border p-3.5 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-gray-900"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                  <button 
                    type="button" 
                    onClick={() => { setStep("forgot"); setMessage({ text: "", type: "" }); }}
                    className="text-[10px] font-bold text-primary hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full border border-card-border p-3.5 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-gray-900"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-8 bg-primary text-white p-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {message.text && (
              <div className={`mt-6 p-4 rounded-xl text-sm font-bold flex items-center space-x-2 ${
                message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              }`}>
                <span>{message.type === "success" ? "✓" : "!"}</span>
                <span>{message.text}</span>
              </div>
            )}

            <p className="mt-8 text-center text-gray-500 text-sm font-medium">
              New here? 
              <Link to="/register" className="text-primary font-bold ml-1.5 hover:underline underline-offset-4">
                Create an account
              </Link>
            </p>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOTPSubmit}>
            <h2 className="text-3xl font-bold mb-2 text-gray-900 tracking-tight">Verification</h2>
            <p className="text-gray-500 mb-8 font-medium">
              We've sent a 6-digit code to <span className="text-gray-900 font-bold">{formData.email}</span>
            </p>

            <div className="mb-8 text-center">
              <input
                type="text"
                placeholder="000000"
                maxLength="6"
                className="w-full border border-card-border p-5 text-center text-3xl font-bold tracking-[12px] rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-gray-900 font-mono"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <button 
              type="button"
              onClick={() => { setStep("login"); setMessage({ text: "", type: "" }); }}
              className="w-full mt-4 text-xs text-gray-400 hover:text-gray-600 font-bold tracking-widest uppercase"
            >
              Back to Sign In
            </button>
          </form>
        )}

        {step === "forgot" && (
          <form onSubmit={handleForgotPasswordSubmit}>
            <h2 className="text-3xl font-bold mb-2 text-gray-900 tracking-tight">Reset Password</h2>
            <p className="text-gray-500 mb-8 font-medium">Enter your email to receive a recovery code.</p>

            <div className="mb-8">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@company.com"
                className="w-full border border-card-border p-3.5 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-gray-900"
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white p-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Sending Code..." : "Send Recovery Code"}
            </button>

            <button 
              type="button"
              onClick={() => { setStep("login"); setMessage({ text: "", type: "" }); }}
              className="w-full mt-4 text-xs text-gray-400 hover:text-gray-600 font-bold tracking-widest uppercase"
            >
              Cancel
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPasswordSubmit}>
            <h2 className="text-3xl font-bold mb-2 text-gray-900 tracking-tight">New Password</h2>
            <p className="text-gray-500 mb-8 font-medium">Enter the recovery code and your new password.</p>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Recovery Code</label>
                <input
                  type="text"
                  placeholder="000000"
                  maxLength="6"
                  className="w-full border border-card-border p-3.5 text-center text-xl font-bold tracking-[8px] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-mono"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-card-border p-3.5 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-gray-900"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-8 bg-primary text-white p-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;