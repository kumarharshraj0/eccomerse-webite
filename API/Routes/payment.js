import express from 'express'
import {
  checkout,
  verify,
  userOrder,
  allOrders,
  updateOrderStatus
} from "../Controllers/payment.js";
import { isUserAuthenticated, isAdminAuthenticated } from '../Middlewares/IsAuth.js';

const router = express.Router();

// checkout
router.post('/checkout', isUserAuthenticated, checkout);

// verify-payment & save to db
router.post('/verify-payment', verify);

// user order
router.get("/userorder", isUserAuthenticated, userOrder);

// All orders
router.get("/orders", isAdminAuthenticated, allOrders);

// ✅ Update order status (Admin only)
router.put("/orders/:id", isAdminAuthenticated, updateOrderStatus);

export default router;
