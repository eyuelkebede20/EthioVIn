import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <h1 className="text-xl font-bold tracking-tight text-blue-600">ETHIO-VIN DECODER</h1>
      <div className="space-x-6 text-sm font-medium">
        <a href="#" className="hover:text-blue-600">
          History
        </a>
        <a href="#" className="hover:text-blue-600">
          Pricing Trends
        </a>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
