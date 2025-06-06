import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../assets/image.jpg";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const validation = (values) => {
    let error = {};

    if (!values.email) {
      error.email = "Email is required.";
    } else if (!email_pattern.test(values.email)) {
      error.email = "User doesn't exist!";
    }

    if (!values.password) {
      error.password = "Password is required.";
    } else if (!password_pattern.test(values.password)) {
      error.password = "Incorrect password.";
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
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        values
      );
      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.log(err.message);
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
            src="logo.jpeg"
            alt="logo"
            className="h-[60px] w-[100px] select-none"
          />
        </a>
      </header>

      <div className="fixed inset-0 flex justify-center items-start mt-[17vh]">
        <div className="shadow-2xl px-8 py-5 w-96 bg-green-500/50 backdrop-blur-[20px] rounded-[10px] border-2">
          <h2 className="text-3xl font-bold mb-4 text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-black font-medium">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
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
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
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
            <button className="w-full bg-black text-white py-2 rounded hover:scale-101 transition cursor-pointer">
              Sign In
            </button>
          </form>
          <div className="text-center">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-white underline">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
