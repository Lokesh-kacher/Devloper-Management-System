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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", formData);

      alert("Registration Successful");

      navigate("/");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-[350px]"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          Register
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          className="w-full border p-3 mb-4 rounded"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          className="w-full border p-3 mb-4 rounded"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          className="w-full border p-3 mb-4 rounded"
          onChange={handleChange}
        />

        <button className="bg-black text-white w-full p-3 rounded">
          Register
        </button>

        <p className="mt-4 text-center">
          Already have account?
          <Link to="/" className="text-blue-500 ml-2">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;