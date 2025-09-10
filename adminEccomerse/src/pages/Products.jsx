import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    qty: "",
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const API_URL = "http://localhost:1000/api/product";
  const navigate = useNavigate();

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      const allProducts = res.data.products || [];
      setProducts(allProducts);
      setFilteredProducts(allProducts);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle category filter
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    if (value === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === value));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Add or Update Product
  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", newProduct.title);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("category", newProduct.category);
      formData.append("qty", newProduct.qty);
      if (imageFile) formData.append("file", imageFile);

      if (editingProductId) {
        // Update product
        await axios.put(`${API_URL}/admin/${editingProductId}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        alert("✅ Product updated successfully");
        setEditingProductId(null);
      } else {
        // Add new product
        await axios.post(`${API_URL}/add`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        alert("✅ Product added successfully");
      }

      // Reset form
      setNewProduct({ title: "", description: "", price: "", category: "", qty: "" });
      setImageFile(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.response?.data?.message || "❌ Failed to save product");
    } finally {
      setUploading(false);
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      qty: product.qty,
    });
    setEditingProductId(product._id);
    setImageFile(null);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API_URL}/admin/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });
      alert("🗑️ Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(error.response?.data?.message || "❌ Failed to delete product");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleAddOrUpdateProduct}
        className="mb-8 bg-white p-4 rounded shadow-md max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingProductId ? "✏️ Edit Product" : "➕ Add New Product"}
        </h2>

        {["title", "description", "price", "category", "qty"].map((field) => (
          <input
            key={field}
            type={field === "price" || field === "qty" ? "number" : "text"}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={newProduct[field]}
            onChange={handleInputChange}
            className="w-full p-2 border rounded mb-2"
            required
          />
        ))}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded mb-2"
        />

        {uploading && <p className="text-blue-500 mb-2">⏳ Saving...</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {editingProductId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Heading & Category Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-semibold">📦 View Your Products</h2>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="mt-3 md:mt-0 p-2 border rounded"
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:scale-105 transform transition duration-300 relative"
          >
            <img
              src={product.img_src || "https://via.placeholder.com/300x200?text=No+Image"}
              alt={product.title}
              className="w-45 h-40 ml-9 pt-2 object-cover cursor-pointer"
              onClick={() => navigate(`/products/${product._id}`)}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {product.description
                  ? product.description.split(" ").slice(0, 20).join(" ") + "..."
                  : ""}
              </p>
              <p className="font-bold text-blue-600 mb-1">₹{product.price}</p>
              <p className="text-gray-500 text-sm mb-1">Category: {product.category}</p>
              <p className="text-gray-500 text-sm mb-2">Qty: {product.qty}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


