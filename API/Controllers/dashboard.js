import { Payment } from "../Models/Payment.js";
import { User } from "../Models/user.js";
import { Products } from "../Models/product.js";

export const getDashboardStats = async (req, res) => {
  try {
    // ✅ Total Sales
    const totalSalesAgg = await Payment.aggregate([
      { $match: { payStatus: "paid" } }, // only paid orders
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalSales = totalSalesAgg[0]?.total || 0;

    // ✅ Orders Count
    const orders = await Payment.countDocuments();

    // ✅ Customers Count (only users with role = "user")
    const customers = await User.countDocuments({ role: "user" });

    // ✅ Products Count
    const products = await Products.countDocuments();

    res.json({
      success: true,
      totalSales,
      orders,
      customers,
      products,
    });
  } catch (error) {
    console.error("❌ Dashboard stats error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};
