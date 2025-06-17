import axios from "axios";
import React, { useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import backgroundImage from "../assets/image.jpg";

const About = () => {
  const navigate = useNavigate();
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/auth/about", {
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

      <div className="fixed inset-0 flex justify-center items-start overflow-y-auto px-4 py-6 sm:py-10 mt-[1vh]">
        <div className="relative mt-[14vh] w-full max-w-[800px] bg-green-500/50 border-2 rounded-xl backdrop-blur-[20px] p-6 sm:p-8 md:p-10 flex flex-col items-center mx-auto">
          <h2 className="text-xl sm:text-2xl leading-[54px] text-black font-bold text-center">
            আমরা কারা?
          </h2>
          <br />
          <p className="text-sm sm:text-base text-black m-0 text-justify">
            অফিস Lorem মরুভূমি অভিজাত ব্যথা cillum যদি না জন্ম হয় মদন পতন
            আনন্দ| কিছু ক্ষেত্রে যেমন Lorem ব্যায়াম কনসেক্টেতুর ব্যায়াম
            ক্ষণস্থায়ী ওকাইক্যাট যার জন্য ব্যথা কিউপিডিটি মরুভূমির ব্যায়ামের
            জন্ম পরিণাম occaecat হয় ক্ষমা দোষ যারা cillum| অন্তত নরম করতে চায়
            যেমন থেকে ক্ষমা করা হয়| প্রেম eu ছাড়া প্রেম নিন্দা করা হয় ফলাফল
            কে| মহৎ প্রেম কি অদম্য ঘটনা পলায়ন করে হতে ঘটবে|
          </p>
          <br />
          <abbr
            title=""
            className="text-sm sm:text-base text-black text-justify"
          >
            কোন না কোনভাবে যারা এখন দুজনের জন্য কষ্ট পাচ্ছে তারাই দোষী। দুজনেরই
            কোন অহংকার মহান ইচ্ছাশক্তি। তারা কি কেউ কেউ দান করে শ্রম থেকে ক্ষমা
            করে।
          </abbr>
          <br />
          <div className="w-full bg-white text-black whitespace-nowrap overflow-hidden animate-scroll-left mt-4">
            <p className="inline-block px-4 text-sm sm:text-base">
              দফতরে অন্ধ পলায়ন পরিয়াতুর উল্লামকোতে লেবারিস - aute Sint velit
              laborum irure dolor ea pariatur laboris veniam| লোরেম প্যারিয়াতুর
              পালাও - Ea velit Lorem sint - কে থেকে|
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
