import { Payment } from "../Models/Payment.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// -------------------- Checkout --------------------
export const checkout = async (req, res) => {
  try {
    const { amount, cartItems, userShipping, userId } = req.body;

    // Validation
    if (!amount || !cartItems?.length || !userShipping || !userId) {
      return res.status(400).json({ error: "Invalid request data", body: req.body });
    }

    console.log("👉 Checkout request payload:", {
      amount,
      cartItemsLength: cartItems?.length,
      userId,
      shipping: userShipping,
    });

    const options = {
      amount: Math.round(amount * 100), // ensure integer paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log("👉 Razorpay order options:", options);

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount,
      cartItems,
      userShipping,
      userId,
      payStatus: "created",
    });
  } catch (err) {
    console.error("❌ Razorpay checkout error:", {
      message: err.message,
      description: err.description,
      stack: err.stack,
    });

    res.status(500).json({
      error: "Payment initiation failed",
      details: err.description || err.message,
    });
  }
};

// -------------------- Verify Payment --------------------
export const verify = async (req, res) => {
  try {
    const { orderId, paymentId, signature, amount, orderItems, userId, userShipping } = req.body;

    if (!orderId || !paymentId || !signature || !amount || !orderItems?.length || !userId || !userShipping) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    // 🔐 Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({ success: false, error: "Invalid signature, possible fraud detected" });
    }

    const orderConfirm = await Payment.create({
      orderId,
      paymentId,
      signature,
      amount,
      orderItems,
      userId,
      userShipping,
      payStatus: "paid",
    });

    res.json({ message: "Payment successful", success: true, orderConfirm });
  } catch (err) {
    console.error("❌ Payment verification error:", err);

    res.status(500).json({
      error: "Payment verification failed",
      details: err.description || err.message,
    });
  }
};

// -------------------- User Orders --------------------
export const userOrder = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const orders = await Payment.find({ userId }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ User order fetch error:", err);
    res.status(500).json({ error: "Failed to fetch user orders", details: err.message });
  }
};

// -------------------- All Orders --------------------
export const allOrders = async (req, res) => {
  try {
    const orders = await Payment.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Fetch all orders error:", err);
    res.status(500).json({ error: "Failed to fetch all orders", details: err.message });
  }
};

// -------------------- Update Order Status --------------------
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Payment.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, message: "Order status updated", order });
  } catch (err) {
    console.error("❌ Update order status error:", err);
    res.status(500).json({ success: false, message: "Failed to update order status", details: err.message });
  }
};
