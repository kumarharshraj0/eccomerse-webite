import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/layout/Sidebar";
import StatCard from "../components/dashboard/StatCard";
import SalesPieChart from "../components/dashboard/SalesPieChart";
import RecentOrders from "../components/orders/RecentOrders";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    orders: 0,
    customers: 0,
    products: 0,
  });

  const API_URL = "http://localhost:1000/api/admin/dashboard"; // make sure you have this endpoint

  const fetchStats = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setStats(res.data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Sales" value={`₹${stats.totalSales}`} />
          <StatCard title="Orders" value={stats.orders} />
          <StatCard title="Customers" value={stats.customers} />
          <StatCard title="Products" value={stats.products} />
        </div>

        {/* Charts + Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesPieChart />
          <RecentOrders />
        </div>
      </main>
    </div>
  );
}

