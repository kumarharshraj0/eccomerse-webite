import { User } from "../Models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// ✅ User Register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.json({ success: false, message: "User already exists" });

    const hashPassword = await bcrypt.hash(password, 10);

    user = await User.create({ name, email, password: hashPassword, role: "user" });

    res.json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ User Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User does not exist" });

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    res.json({ success: true, message: `Welcome ${user.name}`, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Admin Register
export const adminRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let admin = await User.findOne({ email });
    if (admin) return res.json({ success: false, message: "Admin already exists" });

    const hashPassword = await bcrypt.hash(password, 10);

    admin = await User.create({ name, email, password: hashPassword, role: "admin" });

    res.json({
      success: true,
      message: "Admin created successfully",
      admin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Admin Login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.json({ success: false, message: "Admin does not exist" });

    const isPassEqual = await bcrypt.compare(password, admin.password);
    if (!isPassEqual) return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    res.json({ success: true, message: `Welcome Admin ${admin.name}`, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Logout (for both user & admin)
export const logout = async (req, res) => {
  try {
    // Simply tell frontend to clear token
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Get all users
export const users = async (req, res) => {
  try {
    let users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.json(error.message);
  }
};


// ✅ Get profile
export const profile = async (req, res) => {
  res.json({ user: req.user });
};
