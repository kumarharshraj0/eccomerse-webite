import express from "express";
import connectDB from "./database/db.js";
import userRouter from "./Routes/user.js";
import productRouter from "./Routes/product.js";
import cartRouter from "./Routes/cart.js";
import addressRouter from "./Routes/address.js";
import dotenv from "dotenv";
import cors from "cors";
import paymentRouter from './Routes/payment.js'
import dashboardRouter from "./Routes/dashboardRoutes.js"

import cloudinary from "cloudinary"



cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});








dotenv.config();

const app = express();
app.use(express.json());


app.use(
  cors({
    origin: [process.env.CLIENT_ORIGIN,process.env.ADMIN_DASHBOARD_ORIGIN] ,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // must be lowercase!
  })
);

connectDB();

// home testing route
app.get("/", (req, res) => res.json({ message: "This is home route" }));

// routers
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);

// payment Router
app.use('/api/payment',paymentRouter)

// admin dasboard


app.use("/api/admin", dashboardRouter);

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
