import React, { useEffect, useState } from "react";
import AppContext from "./AppContext";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔹 Axios instance with interceptor
export const API = axios.create({
  baseURL: "http://localhost:1000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AppState = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [reload, setReload] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [userOrder, setUserOrder] = useState([]);

  // Restore session
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsAuthenticated(true);
      userProfile();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProduct();
      userProfile();
      userCart();
      getAddress();
      user_Order();
    } else {
      fetchProduct();
    }
  }, [isAuthenticated, reload]);

  // --- API Calls ---
  const fetchProduct = async () => {
    try {
      const res = await API.get("/product/all");
      setProducts(res.data.products || []);
      setFilteredData(res.data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err.message);
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await API.post("/user/register", { name, email, password });
      toast.success(res.data.message, { autoClose: 1500, theme: "dark", transition: Bounce });
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const login = async (email, password) => {
    try {
      const res = await API.post("/user/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
      toast.success(res.data.message, { autoClose: 1500, theme: "dark", transition: Bounce });
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    toast.success("Logout Successfully!", { autoClose: 1500, theme: "dark", transition: Bounce });
  };

  const userProfile = async () => {
    try {
      const res = await API.get("/user/profile");
      setUser(res.data.user);
    } catch (err) {
      console.error("Profile fetch failed:", err.response?.data || err.message);
      logout();
    }
  };

  const addToCart = async (productId, title, price, qty, imgSrc) => {
    try {
      const res = await API.post("/cart/add", { productId, title, price, qty, imgSrc });
      setReload((prev) => !prev);
      toast.success(res.data.message, { autoClose: 1500, theme: "dark", transition: Bounce });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const userCart = async () => {
    try {
      const res = await API.get("/cart/user");
      setCart(res.data.cart || []);
    } catch (err) {
      console.error("Cart fetch failed:", err.response?.data || err.message);
    }
  };

  const decreaseQty = async (productId, qty) => {
    try {
      const res = await API.post("/cart/qty", { productId, qty });
      setReload((prev) => !prev);
      toast.success(res.data.message, { autoClose: 1500, theme: "dark", transition: Bounce });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to decrease qty");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await API.delete(`/cart/remove/${productId}`);
      setReload((prev) => !prev);
      toast.success(res.data.message, { autoClose: 1500, theme: "dark", transition: Bounce });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    }
  };

  const clearCart = async () => {
    try {
      const res = await API.delete("/cart/clear");
      setReload((prev) => !prev);
      toast.success(res.data.message, { autoClose: 1500, theme: "dark", transition: Bounce });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to clear cart");
    }
  };

  const shippingAddress = async (fullName, address, city, state, country, pincode, phoneNumber) => {
    try {
      const res = await API.post("/address/add", {
        fullName, address, city, state, country, pincode, phoneNumber
      });
      setReload((prev) => !prev);
      toast.success(res.data.message, { autoClose: 1500, theme: "dark", transition: Bounce });
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add address");
    }
  };

  const getAddress = async () => {
    try {
      const res = await API.get("/address/get");
      setUserAddress(res.data.userAddress || "");
    } catch (err) {
      console.error("Address fetch failed:", err.response?.data || err.message);
    }
  };

  const user_Order = async () => {
    try {
      const res = await API.get("/payment/userorder");
      setUserOrder(res.data || []);
    } catch (err) {
      console.error("Orders fetch failed:", err.response?.data || err.message);
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        register,
        login,
        logout,
        isAuthenticated,
        filteredData,
        setFilteredData,
        user,
        addToCart,
        cart,
        decreaseQty,
        removeFromCart,
        clearCart,
        shippingAddress,
        userAddress,
        userOrder,
        url: API.defaults.baseURL,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppState;




