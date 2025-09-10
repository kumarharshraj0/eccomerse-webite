import { Products } from "../Models/product.js";
import { Payment } from "../Models/Payment.js";



import cloudinary from "cloudinary";

// Add Product Controller
export const addProduct = async (req, res) => {
  try {
    const { title, description, price, category, qty, createdAt } = req.body;

    if (!title || !description || !price || !category || !qty) {
      return res.status(400).json({ message: "Please fill all fields", success: false });
    }

    let img_src = "";

    // If a file is uploaded via multer
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      img_src = result.secure_url;
    } else if (req.body.img_src) {
      // If frontend sends URL instead
      img_src = req.body.img_src;
    }

    const product = await Products.create({
      title,
      description,
      price,
      category,
      qty,
      createdAt,
      img_src,
    });

    res.status(201).json({
      message: "Product added successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};


// get products

export const getProduct=async(req,res)=>{

    let products=await Products.find().sort({createdAt:-1})
    res.json({message:"All Products",products})
}


// get product by id

export const findbyId=async (req,res)=>{
    
    const id= req.params.id;
    
    let product=await Products.findById(id)
    if(!product){
    return res.json({success:false,message:"product not found for this id"})
    }


    res.json({message:"specific Product",product})
    

}


// update by id

// Update Product by ID
export const updateProductById = async (req, res) => {
  try {
    const id = req.params.id;

    // Find the existing product
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found for this ID" });
    }

    const { title, description, price, category, qty } = req.body;

    if (!title || !description || !price || !category || !qty) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    let img_src = product.img_src; // default to existing image

    // If a new image file is uploaded
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      img_src = result.secure_url;
    } else if (req.body.img_src) {
      // If frontend sends a new image URL
      img_src = req.body.img_src;
    }

    // Update product fields
    product.title = title;
    product.description = description;
    product.price = price;
    product.category = category;
    product.qty = qty;
    product.img_src = img_src;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// delete product by id

export const deleteproductbyId=async (req,res)=>{
    
    const id= req.params.id;
    
    let product=await Products.findByIdAndDelete(id)
    if(!product){
    return res.json({success:false,message:"product not found for this id"})
    }


    res.json({message:" your product has been deleted"})
    

}




// ✅ Sales by Category
export const getSalesByCategory = async (req, res) => {
  try {
    // Fetch all paid orders
    const paidOrders = await Payment.find({ payStatus: "paid" });

    // Create a category sales map
    const categorySales = {};

    for (const order of paidOrders) {
      if (!order.orderItems) continue;

      for (const item of order.orderItems) {
        // Find product to know its category
        const product = await Products.findById(item.product);
        if (!product) continue;

        const totalItemSales = item.qty * product.price;

        if (!categorySales[product.category]) {
          categorySales[product.category] = 0;
        }
        categorySales[product.category] += totalItemSales;
      }
    }

    // Convert object → array
    const result = Object.keys(categorySales).map(category => ({
      category,
      totalSales: categorySales[category],
    }));

    res.json(result);
  } catch (error) {
    console.error("❌ Sales by category error:", error);
    res.status(500).json({ message: "Failed to fetch sales by category" });
  }
};