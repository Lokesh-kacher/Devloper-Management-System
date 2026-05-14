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
    <div className="min-h-screen flex flex-col justify-center items-center bg-main-bg font-tnr p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tighter">DEVPM</h1>
        <p className="text-[10px] text-gray-400 font-bold tracking-[3px] uppercase mt-1">Workspace Manager</p>
      </div>

      <div className="w-full max-w-[420px] bg-white p-10 rounded-[32px] border border-card-border shadow-2xl shadow-primary/5 animate-in fade-in zoom-in-95 duration-500">
        <form onSubmit={handleSubmit}>
          <h2 className="text-3xl font-bold mb-2 text-gray-900 tracking-tight">Create account</h2>
          <p className="text-gray-500 mb-8 font-medium">Join our developer management system today.</p>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className="w-full border border-card-border p-3.5 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-gray-900"
                onChange={handleChange}
                required
              />
            </div>

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
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
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
            {loading ? "Creating Account..." : "Create Account"}
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
            Already have an account? 
            <Link to="/" className="text-primary font-bold ml-1.5 hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;