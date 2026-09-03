import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import client from "prom-client";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoute.js";
import productRoutes from "./routes/productRoute.js";

dotenv.config();
connectDB();

const app = express();

/*
 * Prometheus default metrics
 */
client.collectDefaultMetrics({
  prefix: "olx_",
});

/*
 * CORS
 */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/*
 * Static files
 */
app.use(express.static("public"));

/*
 * Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

/*
 * Prometheus metrics endpoint
 */
app.get("/metrics", async (_req, res) => {
  try {
    res.set(
      "Content-Type",
      client.register.contentType,
    );

    const metrics = await client.register.metrics();

    res.end(metrics);
  } catch (error) {
    res.status(500).send("Failed to collect metrics");
  }
});

app.listen(5005, () =>
  console.log(
    "Server running: http://localhost:5005",
  ),
);