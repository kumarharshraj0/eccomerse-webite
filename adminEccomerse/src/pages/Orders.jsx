import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); // get admin token
        const res = await axios.get("http://localhost:1000/api/payment/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ Handle status change & update backend
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:1000/api/payment/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update locally after successful backend update
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      console.log("Updated:", res.data);
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  if (loading) {
    return <p className="p-6 text-lg">Loading orders...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Payment ID</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{order._id}</td>
                  <td className="px-4 py-2 border">
                    {order.user?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-2 border">₹{order.amount / 100}</td>
                  <td className="px-4 py-2 border">{order.paymentId}</td>
                  <td className="px-4 py-2 border">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className={`px-2 py-1 rounded text-white text-sm ${
                        order.status === "Processing"
                          ? "bg-yellow-500"
                          : order.status === "Shipped"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

