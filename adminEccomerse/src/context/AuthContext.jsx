import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // ✅ Restore user from localStorage on refresh
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");
    return token && email ? { token, email, name } : null;
  });

  const API = axios.create({ baseURL: "http://localhost:1000/api/user" });

  // ===== Login =====
  const login = async (email, password) => {
    try {
      const { data } = await API.post("/admin/login", { email, password });
      if (data.success) {
        const token = data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("name", data.admin?.name || "Admin"); // optional
        setUser({ token, email, name: data.admin?.name || "Admin" });
        navigate("/"); // redirect to dashboard
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  // ===== Signup =====
  const signup = async (name, email, password) => {
    try {
      const { data } = await API.post("/admin/register", { name, email, password });
      if (data.success) {
        const token = data.token || ""; // backend may not return token on register
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("name", name);
        setUser({ token, email, name });
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  // ===== Logout =====
  const logout = async () => {
    try {
      await API.get("/admin/logout", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

