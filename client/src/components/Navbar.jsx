import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("userRole");

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <Link to="/" className="text-xl font-bold tracking-tight text-blue-600">
        ETHIO-VIN DECODER
      </Link>
      <div className="space-x-6 text-sm font-medium flex items-center">
        <Link to="/" className="hover:text-blue-600">
          Home
        </Link>
        <Link to="/history" className="hover:text-blue-600">
          History
        </Link>

        {token && role !== "user" && (
          <Link to="/dashboard" className="hover:text-blue-600">
            Dashboard
          </Link>
        )}

        {token ? (
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
