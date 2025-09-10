import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductDetail() {
  const { id } = useParams(); // ✅ get product id from route
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:1000/api/product";

  // Fetch single product
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      setProduct(res.data.product || null);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // ✅ Delete product
  const handleDeleteProduct = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/admin/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      alert("🗑️ Product deleted successfully");
      navigate("/products"); // ✅ go back to product list
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error.response?.data?.message || "❌ Failed to delete product");
    }
  };

  // ✅ Edit product (redirect to products page where form exists)
  const handleEditProduct = () => {
    navigate("/products", { state: { editId: id } }); // pass product id to Products page
  };

  if (loading) return <p className="p-6 text-blue-500">⏳ Loading product...</p>;
  if (!product) return <p className="p-6 text-red-500">❌ Product not found</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
      >
        ⬅ Back
      </button>

      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-6">
        <img
          src={product.img_src || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={product.title}
          className="w-full md:w-50 h-80 object-cover rounded"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-lg font-semibold text-blue-600 mb-2">₹{product.price}</p>
          <p className="text-gray-500 mb-1">Category: {product.category}</p>
          <p className="text-gray-500 mb-4">Available Qty: {product.qty}</p>

          {/* ✅ Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleEditProduct}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDeleteProduct}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

