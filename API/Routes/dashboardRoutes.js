import express from "express";
import { getDashboardStats } from "../Controllers/dashboard.js";
import { isAdminAuthenticated } from "../Middlewares/IsAuth.js";

const router = express.Router();


router.get("/dashboard", isAdminAuthenticated, getDashboardStats);

export default router;
