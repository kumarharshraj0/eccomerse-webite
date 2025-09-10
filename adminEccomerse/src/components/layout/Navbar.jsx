
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login"); // redirect to admin login page
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/admin/dashboard" className="text-xl font-bold text-blue-600">
          Admin Panel
        </Link>
        <Link
          to="/admin/dashboard"
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Dashboard
        </Link>
        <Link
          to="/admin/products"
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Products
        </Link>
        <Link
          to="/admin/orders"
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Orders
        </Link>
        <Link
          to="/admin/users"
          className="text-gray-700 hover:text-blue-600 transition"
        >
          Users
        </Link>
      </div>

      <div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
