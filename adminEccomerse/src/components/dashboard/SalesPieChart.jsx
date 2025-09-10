import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFE", "#FF6B6B"];

export default function SalesPieChart() {
  const [data, setData] = useState([]);

  const fetchSalesData = async () => {
    try {
      const res = await axios.get("http://localhost:1000/api/product/sales", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // Expected response: [{ category: "Electronics", totalSales: 5000 }, ...]
      const chartData = res.data.map(item => ({
        name: item.category,
        value: item.totalSales,
      }));
      setData(chartData);
    } catch (err) {
      console.error("Failed to fetch sales data:", err);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  if (data.length === 0) return <p>Loading chart...</p>;

  return (
    <div className="rounded-2xl shadow bg-white p-6">
      <h3 className="text-xl font-semibold mb-4">Sales by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
