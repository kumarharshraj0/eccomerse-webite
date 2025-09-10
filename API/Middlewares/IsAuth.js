// Middlewares/IsAuth.js
import jwt from "jsonwebtoken";
import { User } from "../Models/user.js";

// 🔹 Common token verification
const verifyToken = async (req, res) => {
  let token = req.header("Authorization");

  if (!token) {
    return { error: "Login first, token missing" };
  }

  // Remove Bearer prefix if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Support both { id: user._id } and { userId: user._id }
    const userId = decoded.userId || decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return { error: "User not exists" };
    }
    return { user };
  } catch (err) {
    return { error: "Invalid or expired token" };
  }
};

// ✅ User Authenticated
export const isUserAuthenticated = async (req, res, next) => {
  const { user, error } = await verifyToken(req, res);
  if (error) return res.status(401).json({ message: error });

  if (user.role !== "user") {
    return res.status(403).json({ message: "Access denied, user only!" });
  }

  req.user = user;
  next();
};

// ✅ Admin Authenticated
export const isAdminAuthenticated = async (req, res, next) => {
  const { user, error } = await verifyToken(req, res);
  if (error) return res.status(401).json({ message: error });

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admin only!" });
  }

  req.user = user;
  next();
};
