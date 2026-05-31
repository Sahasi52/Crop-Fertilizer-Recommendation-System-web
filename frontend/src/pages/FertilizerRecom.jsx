import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import backgroundImage from "../assets/image.jpg";

export const API_BASE_URL =
  "https://crop-fertilizer-recommendation-system-web.onrender.com";

const FertilizerRecom = () => {
  const navigate = useNavigate();
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/auth/fertilizer_recommendation`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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

  const [formData, setFormData] = useState({
    crop: "",
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
  });
  const [recommendations, setRecommendations] = useState([]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setRecommendations([]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/auth/fertilizer_recommendation`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setRecommendations(response.data.recommendations || []);
    } catch (err) {
      alert("সার প্রস্তাব পেতে ব্যর্থ হয়েছে");
      console.error("Fertilizer recommendation error:", err);
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
            id="home"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeStyle : ""}`
            }
            name="home"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div>
                <label className="block text-black font-medium">
                  ফসলের নাম
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border bg-white rounded"
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-black font-medium">
                  নাইট্রোজেন (N)
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border bg-white rounded"
                  name="N"
                  value={formData.N}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-black font-medium">
                  ফসফরাস (P)
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border bg-white rounded"
                  name="P"
                  value={formData.P}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-black font-medium">
                  পটাসিয়াম (K)
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border bg-white rounded"
                  name="K"
                  value={formData.K}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-black font-medium">
                  তাপমাত্রা (℃)
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border bg-white rounded"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-black font-medium">
                  আর্দ্রতা (%)
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-3 py-2 border bg-white rounded"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleChange}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-black font-medium">pH স্তর</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="w-full px-3 py-2 border bg-white rounded"
                  name="ph"
                  value={formData.ph}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded hover:scale-103 transition"
            >
              প্রস্তাব পান
            </button>
          </form>
          {recommendations.length > 0 && (
            <div className="mt-4 text-center text-lg font-semibold text-black">
              প্রস্তাবিত সার:
              <ul className="mt-2 list-disc list-inside text-base font-normal text-left">
                {recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FertilizerRecom;
