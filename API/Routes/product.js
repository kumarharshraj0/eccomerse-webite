import express from "express";
import multer from "multer";
import { 
  addProduct, deleteproductbyId, findbyId, getProduct, getSalesByCategory, updateProductById 
} from "../Controllers/product.js";
import { isAdminAuthenticated, isUserAuthenticated } from "../Middlewares/IsAuth.js";

const router = express.Router();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Add product
router.post("/add", isAdminAuthenticated, upload.single("file"), addProduct);

// Get all products (admin)
router.get("/admin/all", isAdminAuthenticated, getProduct);

// Get all products (public)
router.get("/all", getProduct);

// Get product by id
router.get("/:id", isUserAuthenticated, findbyId);
router.get("/admin/:id", isAdminAuthenticated, findbyId);

// Update product
router.put("/admin/:id", isAdminAuthenticated, upload.single("file"), updateProductById);

// Delete product
router.delete("/admin/:id", isAdminAuthenticated, deleteproductbyId);



//  Sales by category
router.get("/sales", isAdminAuthenticated, getSalesByCategory);

export default router;

