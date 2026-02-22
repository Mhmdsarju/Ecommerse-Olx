import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoute.js";
import productRoutes from "./routes/productRoute.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "http://localhost:5173",credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.listen(5005, () =>
  console.log("Server running: http://localhost:5005")
);
