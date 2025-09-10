import React, { useState } from "react";

export default function Customers() {
  // Sample messages (replace with API data later)
  const [messages] = useState([
    { id: 1, customer: "Alice Johnson", subject: "Order Delay", message: "My order is delayed, please check." },
    { id: 2, customer: "John Doe", subject: "Product Inquiry", message: "Is the laptop available in black?" },
    { id: 3, customer: "Jane Smith", subject: "Return Request", message: "I want to return my headphones." },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Customer Messages</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Subject</th>
              <th className="px-4 py-2 border">Message</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{m.customer}</td>
                <td className="px-4 py-2 border">{m.subject}</td>
                <td className="px-4 py-2 border">{m.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

