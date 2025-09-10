import React from "react";
import { NavLink } from "react-router-dom";
import { Home, ShoppingCart, Users, Package, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { logout, user } = useAuth();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: ShoppingCart, label: "Orders", path: "/orders" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: Users, label: "Customers", path: "/customers" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <div className="p-4 border-b border-gray-200 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          {user && <p className="text-sm text-gray-500 mt-1">{user.email}</p>}
        </div>

        <nav className="flex-1 flex flex-col space-y-1 px-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg transition relative ${
                  isActive
                    ? "bg-blue-500 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <Icon className="mr-3 h-5 w-5" />
              <span>{label}</span>
              {/** Side indicator for active */}
              {({ isActive }) =>
                isActive && (
                  <span className="absolute left-0 h-full w-1 bg-blue-600 rounded-r-full"></span>
                )
              }
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Logout */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-red-500 hover:bg-red-100 rounded-lg transition"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}
