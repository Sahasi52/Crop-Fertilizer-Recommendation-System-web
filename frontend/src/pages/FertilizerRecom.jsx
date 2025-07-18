import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import backgroundImage from "../assets/image.jpg";

const FertilizerRecom = () => {
  const navigate = useNavigate();
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/auth/fertilizer_recommendation",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 201) {
        navigate("/login");
      }
    } catch (err) {
      navigate("/login");
      console.log(err);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const [cropName, setCropName] = useState("");
  const [fertilizer, setFertilizer] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/auth/fertilizer_recommendation",
        { crop_name: cropName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFertilizer(response.data.recommendation);
    } catch (err) {
      console.error(err);
    }
  };
  const navLinkBase =
    "relative text-black font-medium hover:text-green-500 after:absolute after:left-0 after:-bottom-1.5 after:h-[3px] after:w-full after:bg-green-500 after:rounded-md after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-right hover:after:origin-left transition";
  const activeStyle =
    "text-green-500 after:absolute after:left-0 after:-bottom-1.5 after:h-[3px] after:w-full after:bg-green-500 after:rounded-md after:scale-x-100";
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
      <header className="fixed top-0 left-0 w-full z-[99] bg-white px-4 md:px-24 py-2 flex items-center justify-between">
        <Link to="/">
          <img
            src="/logo.jpeg"
            alt="logo"
            className="h-[50px] w-[80px] select-none"
          />
        </Link>
        <nav className="hidden lg:flex items-center space-x-10">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeStyle : ""}`
            }
          >
            হোম
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeStyle : ""}`
            }
          >
            সম্পর্কে
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeStyle : ""}`
            }
          >
            যোগাযোগ
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-[100px] h-[45px] border-2 border-black rounded-md text-black font-medium hover:bg-green-500 hover:text-white hover:border-green-500 transition flex items-center justify-center cursor-pointer"
          >
            লগআউট
          </button>
        </nav>
        {/* Mobile/Tablet Hamburger Menu */}
        <div className="lg:hidden relative">
          <details className="relative">
            <summary className="cursor-pointer list-none">
              <svg
                className="h-8 w-8 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 50 25"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </summary>
            <div className="absolute -right-25 mt-2 w-75 h-250 bg-white shadow-md rounded-md p-8 z-50 space-y-10">
              <NavLink to="/" className="block text-black font-medium">
                হোম
              </NavLink>
              <NavLink to="/about" className="block text-black font-medium">
                সম্পর্কে
              </NavLink>
              <NavLink to="/contact" className="block text-black font-medium">
                যোগাযোগ
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-[150px] h-[45px] border-2 border-black rounded-md text-black font-medium py-2 hover:bg-green-500 hover:text-white hover:border-green-500 transition"
              >
                লগআউট
              </button>
            </div>
          </details>
        </div>
      </header>
      <div className="fixed inset-0 flex justify-center items-start overflow-y-auto px-4 py-6 sm:py-10">
        <div className="bg-green-500/50 border-2 rounded-xl backdrop-blur-[20px] p-6 sm:p-8 md:p-10 w-full max-w-xl mt-[14vh]">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
            সার প্রস্তাব
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-black font-medium">ফসলের নাম</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border bg-white rounded"
                name="crop_name"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:scale-103 transition cursor-pointer"
            >
              প্রস্তাব পান
            </button>
          </form>
          {fertilizer && (
            <div className="mt-4 text-center text-lg font-semibold text-black">
              প্রস্তাবিত সার: {fertilizer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FertilizerRecom;
