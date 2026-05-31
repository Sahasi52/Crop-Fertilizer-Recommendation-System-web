import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import backgroundImage from "../assets/image.jpg";

export const API_BASE_URL =
  "https://crop-fertilizer-recommendation-system-web.onrender.com";

const UpdateUser = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const validation = (values) => {
    let error = {};
    if (!values.username) {
      error.username = "Name is required.";
    }

    if (!password_pattern.test(values.password)) {
      error.password =
        "The password must contain 1 uppercase letter, 1 lowercase letter, 1 number and at least 8 characters.";
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

    const updatePayload = { username: values.username, email: values.email };
    if (values.password) updatePayload.password = values.password;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/auth/update/` + id,
        updatePayload
      );
      if (response.status === 201) {
        navigate("/admin");
      }
    } catch (err) {
      const message = err?.response?.data?.message;
      let error = {};
      if (message === "Please use a different password.") {
        error.password = "Please use a different password.";
      } else {
        console.log(err.message);
      }
      setErrors(error);
    }
  };
  const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/update/` + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setValues({
        username: response.data.username || "",
        email: response.data.email || "",
        password: "",
      });
    } catch (err) {
      const message = err?.response?.data?.message;
      if (message === "Unauthorized!") {
        navigate("/");
      } else {
        navigate("/login");
      }
      console.log(err);
    }
  };
  useEffect(() => {
    checkToken();
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
      <header className="fixed w-full bg-white py-1 flex items-center justify-around z-10 px-4 sm:px-8">
        <a href="/">
          <img
            src="/logo.jpeg"
            alt="logo"
            className="h-[50px] w-[90px] sm:h-[60px] sm:w-[100px] select-none"
          />
        </a>
      </header>
      <div className="fixed inset-0 flex justify-center items-start pt-[17vh] px-4 sm:px-0">
        <div className="w-full max-w-md bg-green-500/50 backdrop-blur-[20px] rounded-[10px] border-2 px-6 py-5 sm:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-start text-black">
            Update User
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="block text-black font-medium">Username</label>
              <input
                type="text"
                name="username"
                value={values.username}
                placeholder="Enter username"
                className="w-full px-3 py-2 border bg-white rounded"
                onChange={handleChanges}
              />
              {errors.username && (
                <span className="text-red-600 text-sm mt-1 block">
                  {errors.username}
                </span>
              )}
            </div>
            <div className="mb-2">
              <label className="block text-black font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={values.email}
                placeholder="Enter email"
                className="w-full px-3 py-2 border bg-white rounded"
                onChange={handleChanges}
                disabled
              />
              {errors.email && (
                <span className="text-red-600 text-sm mt-1 block">
                  {errors.email}
                </span>
              )}
            </div>
            <div className="mb-2">
              <label className="block text-black font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={values.password}
                placeholder="Enter a new password"
                className="w-full px-3 py-2 border bg-white rounded"
                onChange={handleChanges}
              />
              {errors.password && (
                <span className="text-red-600 text-sm mt-1 block">
                  {errors.password}
                </span>
              )}
            </div>
            <button className="bg-black text-white p-2 rounded hover:scale-103 transition cursor-pointer">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
