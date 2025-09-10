// Routes/userRoutes.js
import express from "express";
import {
  register,
  login,
  logout,
  profile,
  adminRegister,
  adminLogin,
  users
} from "../Controllers/user.js";
import {
  isUserAuthenticated,
  isAdminAuthenticated,
} from "../Middlewares/IsAuth.js";

const router = express.Router();


// ====================== ✅ USER ROUTES ======================

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

// Logout user
router.get("/logout", logout);

// Get profile (user only)
router.get("/profile", isUserAuthenticated, profile);



// ====================== ✅ ADMIN ROUTES ======================

// Register admin
router.post("/admin/register", adminRegister);

// Login admin
router.post("/admin/login", adminLogin);


// Logout admin
router.get("/admin/logout", logout);

// Get profile (admin only)
router.get("/admin/profile", isAdminAuthenticated, profile);

// get all user detail

router.get("/all",isAdminAuthenticated,users)


export default router;

