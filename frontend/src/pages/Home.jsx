import axios from "axios";
import React, { useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import backgroundImage from "../assets/image.jpg";

const Home = () => {
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/auth/home", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
            src="logo.jpeg"
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
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeStyle : ""}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? activeStyle : ""}`
            }
          >
            Contact
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-[100px] h-[45px] border-2 border-black rounded-md text-black font-medium hover:bg-green-500 hover:text-white hover:border-green-500 transition flex items-center justify-center cursor-pointer"
          >
            Logout
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
                Home
              </NavLink>
              <NavLink to="/about" className="block text-black font-medium">
                About
              </NavLink>
              <NavLink to="/contact" className="block text-black font-medium">
                Contact
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-[150px] h-[45px] border-2 border-black rounded-md text-black font-medium py-2 hover:bg-green-500 hover:text-white hover:border-green-500 transition"
              >
                Logout
              </button>
            </div>
          </details>
        </div>
      </header>

      <section className="absolute mt-[15vh] w-full px-8 md:px-[40px] flex flex-col items-start justify-center">
        <h1 className="text-[2rem] md:text-[2.8rem] leading-[40px] md:leading-[60px] text-white font-bold">
          Welcome to AgriSense
        </h1>
        <p className="text-white text-sm md:text-base pb-4 md:pb-6">
          A Data-Driven Solution For Smart Farming
        </p>
        <div className="flex justify-center self-center mb-4 flex-wrap gap-4">
          <Link
            to="/crop_recommendation"
            className="px-[30px] py-[25px] md:px-[50px] md:py-[35px] m-[20px] md:m-[75px] bg-green-500/50 backdrop-blur-[20px] rounded-[10px] shadow text-black font-medium text-sm md:text-base hover:scale-105 hover:bg-white/50 transition border-2"
          >
            Crop
            <br />
            Recommendation
          </Link>
          <Link
            to="/fertilizer_recommendation"
            className="px-[30px] py-[25px] md:px-[50px] md:py-[35px] m-[20px] md:m-[75px] bg-green-500/50 backdrop-blur-[20px] rounded-[10px] shadow text-black font-medium text-sm md:text-base hover:scale-105 hover:bg-white/50 transition border-2"
          >
            Fertilizer
            <br />
            Recommendation
          </Link>
        </div>
        <h4 className="text-white text-sm md:text-lg self-center italic font-bold">
          Empowering Farmers with Precision and Insight.....
        </h4>
      </section>
    </div>
  );
};

export default Home;
