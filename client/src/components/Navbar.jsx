import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("userRole");
  const email = sessionStorage.getItem("userEmail") || "User";
  const credits = 100;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsOpen(false);
    navigate("/login");
  };

  const handleSwitchAccount = () => {
    sessionStorage.clear();
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm relative z-50">
      <Link to="/" className="text-xl font-bold tracking-tight text-blue-600">
        ETHIO-VIN
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
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 bg-blue-100 border-2 border-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 transition focus:outline-none"
            >
              <span className="font-bold text-blue-800 uppercase">{email.charAt(0)}</span>
            </button>

            {isOpen && <ProfileCard email={email} role={role} credits={credits} onSwitchAccount={handleSwitchAccount} onLogout={handleLogout} />}
          </div>
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
