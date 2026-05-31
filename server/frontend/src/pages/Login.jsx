import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../assets/image.jpg";

export const API_BASE_URL =
  "https://crop-fertilizer-recommendation-system-web.onrender.com";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const validation = (values) => {
    let error = {};
    if (!values.email) {
      error.email = "ইমেল প্রয়োজন|";
    }

    if (!values.password) {
      error.password = "পাসওয়ার্ড প্রয়োজন|";
    }

    return error;
  };
  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validation(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, values);
      if (values.email === "admin@gmail.com") {
        localStorage.setItem("token", response.data.token);
        navigate("/admin");
      } else {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      }
    } catch (err) {
      const message = err?.response?.data?.message;
      let error = {};
      if (message === "User doesn't exist!") {
        error.email = "ব্যবহারকারীর অস্তিত্ব নেই!";
      } else if (message === "Incorrect password.") {
        error.password = "ভুল পাসওয়ার্ড|";
      } else {
        console.log(err.message);
      }
      setErrors(error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <header className="fixed w-full bg-white py-1 flex items-center justify-around">
        <a href="/">
          <img
            src="/logo.jpeg"
            alt="logo"
            className="h-[60px] w-[100px] select-none"
          />
        </a>
      </header>
      <div className="fixed inset-0 flex justify-center items-start mt-[17vh]">
        <div className="shadow-2xl px-8 py-5 w-96 bg-green-500/50 backdrop-blur-[20px] rounded-[10px] border-2">
          <h2 className="text-3xl font-bold mb-4 text-center">লগইন করুন</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-black font-medium">
                ইমেইল
              </label>
              <input
                id="email"
                type="email"
                placeholder="ইমেইল লিখুন"
                className="w-full px-3 py-2 border bg-white rounded"
                name="email"
                onChange={handleChanges}
              />
              {errors.email && (
                <span className="text-red-600 text-sm mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-black font-medium"
              >
                পাসওয়ার্ড
              </label>
              <input
                id="password"
                type="password"
                placeholder="পাসওয়ার্ড লিখুন"
                className="w-full px-3 py-2 border bg-white rounded"
                name="password"
                onChange={handleChanges}
              />
              {errors.password && (
                <span className="text-red-600 text-sm mt-1 block">
                  {errors.password}
                </span>
              )}
            </div>
            <button
              id="signin"
              className="w-full bg-black text-white py-2 rounded hover:scale-103 transition cursor-pointer"
              name="signin"
            >
              সাইন ইন করুন
            </button>
          </form>
          <div className="text-center">
            <span>কোন অ্যাকাউন্ট নেই? </span>
            <Link to="/register" className="text-white underline">
              নিবন্ধন করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
