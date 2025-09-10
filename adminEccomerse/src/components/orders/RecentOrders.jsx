import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const API_URL = "http://localhost:1000/api/payment/orders"; // backend route for all orders (admin)

  const fetchRecentOrders = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Take only 10 most recent orders
      setOrders(res.data.slice(0, 10));
    } catch (err) {
      console.error("Failed to fetch recent orders:", err);
    }
  };

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  return (
    <div className="rounded-2xl shadow bg-white p-6">
      <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
      <ul className="space-y-3">
        {orders.map((order, idx) => (
          <li key={order._id || idx} className="flex justify-between border-b pb-2">
            <span>Order #{order._id.slice(-4)}</span>
            <span className="font-semibold">₹{order.amount}</span>
          </li>
        ))}
        {orders.length === 0 && <li>No recent orders</li>}
      </ul>
    </div>
  );
}


