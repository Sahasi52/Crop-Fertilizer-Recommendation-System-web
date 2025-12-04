import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/image.jpg";

export const API_BASE_URL =
  "https://crop-fertilizer-recommendation-system-web.onrender.com";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      const message = err?.response?.data?.message;
      if (message === "Unauthorized!") {
        navigate("/admin");
      } else {
        navigate("/login");
      }
      console.log(err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/auth/add/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  if (loading)
    return (
      <p className="text-white text-center mt-20 text-lg sm:text-xl">
        Loading users...
      </p>
    );

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
        <div className="w-full sm:w-[90vw] max-w-6xl bg-green-500/50 backdrop-blur-[20px] rounded-[10px] border-2 p-4 sm:p-6 overflow-auto">
          <Link
            to="/add"
            className="inline-block mb-4 bg-black text-white px-4 py-2 rounded hover:scale-105 transition"
          >
            Add +
          </Link>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded text-left text-sm sm:text-base">
              <thead>
                <tr>
                  <th className="px-2 sm:px-4 py-2">Username</th>
                  <th className="px-2 sm:px-4 py-2">Email</th>
                  <th className="px-2 sm:px-4 py-2">Password</th>
                  <th className="px-2 sm:px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-2 sm:px-4 py-2 min-w-[100px] truncate">
                        {user.username}
                      </td>
                      <td className="px-2 sm:px-4 py-2 min-w-[150px] truncate">
                        {user.email}
                      </td>
                      <td className="px-2 sm:px-4 py-2 min-w-[100px] truncate">
                        ••••••••
                      </td>
                      <td className="px-2 sm:px-4 py-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Link
                            to={`/update/${user.id}`}
                            className="bg-black text-white px-3 py-1 rounded text-sm hover:scale-105"
                          >
                            Update
                          </Link>
                          <button
                            className="bg-black text-white px-3 py-1 rounded text-sm hover:scale-105"
                            onClick={(e) => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
